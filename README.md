# FlashInfo

Application complète FlashInfo avec backend Spring Boot et frontend React.

## Structure du projet

```
FlashInfo/
├── FlashInfoBackend/    # Application Spring Boot
└── FlashInfoFrontend/   # Application React + Vite
```

## Backend (FlashInfoBackend)

Application Spring Boot pour la gestion des données FlashInfo.

### Technologies
- Java
- Spring Boot
- Maven
- JPA/Hibernate

### Lancer le backend
```bash
cd FlashInfoBackend
mvn spring-boot:run
```

## Frontend (FlashInfoFrontend)

Interface utilisateur React avec Vite.

### Technologies
- React
- Vite
- TailwindCSS

### Lancer le frontend
```bash
cd FlashInfoFrontend
npm install
npm run dev
```

## Développement

1. Démarrer le backend sur le port 8080
2. Démarrer le frontend sur le port configuré (généralement 5173)
3. Accéder à l'application via le navigateur
