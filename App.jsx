import * as React from 'react';
import {AppProvider} from './src/app/Context/AppContext.jsx';
import {AppNavigator} from './src/app/Navigation/AppNavigator.jsx';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
         <AppNavigator/>
      </AppProvider>
    </SafeAreaProvider>
  );
}