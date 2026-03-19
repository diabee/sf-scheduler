import ReactDOM from 'react-dom/client';
import App from './app/App';
import AppProvider from './app/AppProvider';
import './i18n';
import './index.css';

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <AppProvider>
      <App />
    </AppProvider>,
  );
}
