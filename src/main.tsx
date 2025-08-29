import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react'

const rootElement = document.getElementById("root")!;
const domain = import.meta.env.VITE_AUTH0_DOMAIN as string | undefined;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined;
const redirectUri = (import.meta.env.VITE_AUTH0_REDIRECT_URI as string | undefined) ?? `${window.location.origin}/callback`;

if (!domain || !clientId) {
  console.error("Missing Auth0 env vars. Ensure VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID are set in the project root .env file.");
  createRoot(rootElement).render(
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 20, marginBottom: 8 }}>Configuration error</h1>
      <p>Missing Auth0 environment variables.</p>
      <pre style={{ background: '#f6f8fa', padding: 12, borderRadius: 6, marginTop: 12 }}>
        {`Set these in .env (project root):\nVITE_AUTH0_DOMAIN=your-tenant.us.auth0.com\nVITE_AUTH0_CLIENT_ID=yourClientId`}
      </pre>
    </div>
  );
} else {
  createRoot(rootElement).render(
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
    >
      <App />
    </Auth0Provider>
  );
}
