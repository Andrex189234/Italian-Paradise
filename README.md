# GUIDA COMPILAZIONE SU WINDOWS 10

Questa guida spiega come compilare ed eseguire **Italian Paradise** su Windows 10.

---

## 1. PREREQUISITI

* **Node.js** (versione 16+)
* **Yarn** (per la gestione pacchetti frontend)
* **Python 3.8+** (per backend)
* **Git** (per clonare repository)
* **MongoDB** (locale oppure Atlas)

---

## 2. CLONAZIONE DEL PROGETTO

```powershell
cd C:\Users\\<TUO_UTENTE>\\Downloads
# Clona repository
git clone https://github.com/<USERNAME>/<REPO>.git
cd <REPO>
```

---

## 3. INSTALLAZIONE FRONTEND

```powershell
cd frontend
npm install --global yarn   # installa Yarn se non presente
yarn install                # installa dipendenze
```

Se ottieni errori di rete:

```powershell
yarn cache clean --force
yarn install --network-concurrency 1
```

---

## 4. CONFIGURAZIONE FRONTEND

Crea file `.env` dentro `frontend/`:

```
REACT_APP_BACKEND_URL=http://localhost:8001
```

---

## 5. INSTALLAZIONE BACKEND

```powershell
cd ..\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Crea file `.env` dentro `backend/`:

```
MONGO_URL=mongodb://localhost:27017
DB_NAME=italian_paradise
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 6. AVVIO DATABASE

Se MongoDB locale è installato:

```powershell
net start MongoDB
```

Oppure usa MongoDB Atlas e aggiorna la variabile `MONGO_URL`.

---

## 7. AVVIO BACKEND

```powershell
cd backend
venv\Scripts\activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Backend API disponibile su [http://localhost:8001](http://localhost:8001).

---

## 8. AVVIO FRONTEND

In un nuovo terminale:

```powershell
cd frontend
yarn start
```

Applicazione disponibile su [http://localhost:3000](http://localhost:3000).

---

## 9. RISOLUZIONE PROBLEMI

* **Errore rete Yarn** → usa: `yarn install --network-concurrency 1`
* **Backend non parte** → verifica Python 3.8+, variabili `.env` e MongoDB attivo.
* **Frontend bianco** → controlla console browser (F12 > Console).

---

**Buon divertimento con Italian Paradise!**
