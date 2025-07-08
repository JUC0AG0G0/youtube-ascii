# youtube-ascii

Extension Chrome qui convertit en temps réel une vidéo YouTube en ASCII art animé directement dans un canvas superposé.

Le rendu s’effectue sur un canvas placé juste après la vidéo, affichant un filtre visuel ASCII en temps réel.

---

## 🔗 Clone du dépôt

```bash
git clone https://github.com/JUC0AG0G0/youtube-ascii.git
```

---

## 🔍 Installation

1. Cloner le dépôt

   ```bash
   git clone https://github.com/JUC0AG0G0/youtube-ascii.git
   cd youtube-ascii
   ```

2. Charger l’extension dans Chrome

   * Ouvrir `chrome://extensions/` dans Chrome
   * Activer le **Mode développeur** (coin supérieur droit)
   * Cliquer sur "**Charger l’extension non empaquetée**"
   * Sélectionner le dossier `youtube-ascii`

3. Activé l’extension dans Chrome

   * Selectionné l'extension et cliqué sur le bouton activé

---

## ⚙️ Fonctionnalités

* 🎨 Option d’affichage en couleur ou monochrome (configurable)
* 🔄 Adaptation dynamique aux changements de vidéo
* 🧠 Détection automatique de la vidéo active sur la page YouTube

---

## 📁 Structure du projet

```text
youtube-ascii/
├── manifest.json       # Déclaration de l'extension
├── popup.html          # Interface utilisateur
├── popup.js            # Logique de l'UI et injection du script ASCII
├── styles.css          # (optionnel) styles
└── icons/              # Icônes de l’extension
```

---

Projet créé par [JUC0AG0G0](https://github.com/JUC0AG0G0)
