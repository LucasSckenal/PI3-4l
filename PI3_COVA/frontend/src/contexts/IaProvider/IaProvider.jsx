import { createContext, useContext, useState } from 'react';

const IaContext = createContext();

export function IaProvider({ children }) {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendPrompt = async (prompt) => {
    setIsLoading(true);
    setResponse('');

    try {
      const res = await fetch('http://localhost:5000/api/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.startsWith('data: '));
        
        lines.forEach(line => {
          const data = JSON.parse(line.replace('data: ', ''));
          setResponse(prev => prev + data.response);
        });
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IaContext.Provider value={{ response, isLoading, sendPrompt }}>
      {children}
    </IaContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useIA = () => useContext(IaContext);