// Jest setup para saída mais elegante
// Suprime logs desnecessários durante os testes

// Suprime console.log do dotenv durante os testes
const originalConsoleLog = console.log;
console.log = (...args) => {
  // Filtra mensagens do dotenv
  if (args[0] && typeof args[0] === 'string' && args[0].includes('[dotenv@')) {
    return;
  }
  // Filtra mensagens de setup/cleanup dos testes
  if (args[0] && typeof args[0] === 'string' && 
      (args[0].includes('Setting up test environment') || 
       args[0].includes('Cleaning up test environment'))) {
    return;
  }
  originalConsoleLog.apply(console, args);
};

// Suprime warnings específicos durante os testes
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  // Permite warnings importantes, mas filtra os esperados
  if (args[0] && typeof args[0] === 'string') {
    // Filtra warnings específicos que são esperados nos testes
    const expectedWarnings = [
      'Cache get error for word:',
      'Cache set error for word:',
      'Cache delete error for word:',
      'Invalid JSON in cache for word:'
    ];
    
    if (expectedWarnings.some(warning => args[0].includes(warning))) {
      return;
    }
  }
  originalConsoleWarn.apply(console, args);
};