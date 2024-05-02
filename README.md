# Guild battle Master

## Description
A rédiger

## Installation

### Installer les dépendances
```bash
pnpm install
```

### Configurer les variables d'environnement
Dans les dossiers front et back, créer un fichier `.env` ou `.env.local` à partir du fichier `.env.example` et renseigner les variables d'environnement.

### Lancer le serveur de développement
```bash
pnpm dev
```

### Lancer le build du front
```bash
cd apps/front
pnpm build
```

### Lancer le build du back
```bash
cd apps/back
pnpm build
```

### Lancer le serveur de production
```bash
cd build
npm ci --omit="dev"
node bin/server.js
```

### Lancer les migrations
```bash
node ace migration:run
```

### Créer les monstres
Il faut tout d'abord insérer le fichier `get_monsters.js` dans le dossier de votre API. Cette action prendra un certain temps, car elle va récupérer les données de la plupart des monstres du jeu.
```bash
pnpm monsters
```