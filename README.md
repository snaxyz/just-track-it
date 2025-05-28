# just-track-it

## Getting started

### Setup secrets

```bash
cp .env.template .env
```

#### Auth0

Setup auth0 application.
Copy the secrets into `.env` file

```bash
AUTH0_DOMAIN=
# generate using openssl rand -base64 32
AUTH0_SECRET=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
```

Setup allowed callback URLs

`http://localhost:3000/auth/callback`

#### Websocket server

Generate a new secret for `SOCKET_SECRET`

```bash
openssl rand -base64 32
```

#### OpenAI

set the

```bash
OPENAI_API_KEY=
# optional if needed
OPENAI_ORG=
```

### Startup

```bash
# spin up docker resources
docker compose up -d
# setup local lambda and dynamodb via localstack
yarn
yarn
```
