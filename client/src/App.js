import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');  // Point to your backend server

const App = () => {
  useEffect(() => {
    // Listen for the 'welcome' event
    socket.on('welcome', (message) => {
      console.log(message);  // Should print: "Hello from the server!"
    });

    // Clean up socket connection on component unmount
    return () => {
      socket.off('welcome');
    };
  }, []);

  return <div>Welcome to the React App!</div>;
};

export default App;
