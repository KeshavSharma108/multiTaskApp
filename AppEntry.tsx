import { registerRootComponent } from 'expo';
import App from './App';
import React from 'react';

// 👇 Do NOT use React.StrictMode here
const Root = () => <App />;

registerRootComponent(Root);
