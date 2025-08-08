import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';
import server from "./server.js";

// Load environment variables
dotenv.config({ path: './.env' });

const execAsync = promisify(exec);
const PORT = process.env.PORT || 3030;

const killProcessOnPort = async (port: number): Promise<void> => {
    try {
        // For Windows (WSL environment)
        const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
        
        if (stdout) {
            const lines = stdout.trim().split('\n');
            const pids = new Set<string>();
            
            for (const line of lines) {
                const parts = line.trim().split(/\s+/);
                if (parts.length >= 5 && parts[1].includes(`:${port}`)) {
                    const pid = parts[4];
                    if (pid && pid !== '0') {
                        pids.add(pid);
                    }
                }
            }
            
            for (const pid of pids) {
                try {
                    await execAsync(`taskkill /F /PID ${pid}`);
                    console.log(`✅ Killed process ${pid} on port ${port}`);
                } catch (killErr) {
                    console.log(`⚠️  Could not kill process ${pid}: ${killErr}`);
                }
            }
        }
    } catch (err) {
        // If netstat fails, try alternative approach for Linux/WSL
        try {
            const { stdout } = await execAsync(`lsof -ti:${port}`);
            if (stdout) {
                const pids = stdout.trim().split('\n').filter(pid => pid);
                for (const pid of pids) {
                    try {
                        await execAsync(`kill -9 ${pid}`);
                        console.log(`✅ Killed process ${pid} on port ${port}`);
                    } catch (killErr) {
                        console.log(`⚠️  Could not kill process ${pid}: ${killErr}`);
                    }
                }
            }
        } catch (lsofErr) {
            console.log(`ℹ️  No processes found on port ${port} or unable to check`);
        }
    }
};

const start = async () => {
    try {
        // Kill any existing processes on the target port
        console.log(`🔍 Checking for processes on port ${PORT}...`);
        await killProcessOnPort(Number(PORT));
        
        // Wait a moment for processes to fully terminate
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        await server.listen({
            host: '0.0.0.0',
            port: Number(PORT)
        });
        server.log.info(`Server running on port ${PORT}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();