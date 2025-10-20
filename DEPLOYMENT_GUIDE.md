# Deployment-Anleitung für "time master" auf Infomaniak

Diese Anleitung führt Sie durch die Schritte, um die "time master"-Anwendung auf Ihrem Infomaniak Webhosting zu installieren.

## Voraussetzungen

1.  **SSH-Zugang:** Sie benötigen einen SSH-Zugang zu Ihrem Webhosting.
2.  **Datenbank:** Sie müssen eine MariaDB-Datenbank in Ihrem Infomaniak-Admin-Panel erstellt haben. Notieren Sie sich die folgenden Informationen:
    *   Datenbank-Host (z.B. `127.0.0.1` oder ein spezifischer Hostname)
    *   Datenbank-Name
    *   Datenbank-Benutzer
    *   Datenbank-Passwort
3.  **Git:** Git muss auf Ihrem Hosting-Server verfügbar sein.

## Schritt 1: Code auf den Server laden

1.  Verbinden Sie sich per SSH mit Ihrem Server.
2.  Navigieren Sie in das Verzeichnis, in dem Ihre Websites liegen (oft `~/sites/<domain>` bei Infomaniak).
3.  Legen Sie einen eigenen Unterordner für die Anwendung an, damit alles sauber beisammen bleibt, z.B. `~/sites/app.wrtm.ch/nelius`:
    ```bash
    mkdir -p ~/sites/app.wrtm.ch/nelius
    cd ~/sites/app.wrtm.ch/nelius
    ```
4.  Klonen Sie das Projekt-Repository in diesen neuen Ordner:
    ```bash
    git clone <repository_url> .
    ```

## Schritt 2: Konfiguration anpassen

1.  Laravel benötigt eine `.env`-Konfigurationsdatei. Die Vorlage `.env.example` existiert bereits. Kopieren Sie diese:
    ```bash
    cp .env.example .env
    ```
2.  Öffnen Sie die `.env`-Datei mit einem Texteditor (z.B. `nano .env`).
3.  **Passen Sie die Datenbank-Einstellungen an:** Suchen Sie die `DB_`-Variablen und tragen Sie die Werte Ihrer Infomaniak-Datenbank ein.
    ```
    DB_CONNECTION=mysql
    DB_HOST=...
    DB_PORT=3306
    DB_DATABASE=...
    DB_USERNAME=...
    DB_PASSWORD=...
    ```
4.  **Setzen Sie die `APP_URL`:** Tragen Sie die endgültige URL Ihrer Anwendung ein (z.B. `https://app.wrtm.ch/nelius`).
5.  **Aktivieren Sie den Unterverzeichnis-Betrieb:** Hinterlegen Sie den gewünschten Unterordner (z.B. `/nelius`) in `APP_BASE_PATH` und setzen Sie `ASSET_URL` auf die gleiche URL wie `APP_URL`. Dadurch erzeugt Laravel korrekte Link- und Asset-Pfade für das Unterverzeichnis.
6.  **Generieren Sie einen App-Schlüssel:** Führen Sie diesen Befehl aus, um die Anwendung zu sichern.
    ```bash
    php artisan key:generate
    ```

## Schritt 3: Abhängigkeiten installieren und Datenbank vorbereiten

1.  Installieren Sie die PHP-Abhängigkeiten mit Composer:
    ```bash
    composer install --no-dev --optimize-autoloader
    ```
2.  Installieren Sie die JavaScript-Abhängigkeiten und kompilieren Sie die Frontend-Assets:
    ```bash
    npm install
    npm run build
    ```
3.  Führen Sie die Datenbank-Migrationen aus, um alle Tabellen zu erstellen, und füllen Sie die Datenbank mit den Standard-Kategorien:
    ```bash
    php artisan migrate --seed
    ```

## Schritt 4: Webserver-Konfiguration & Dateien kopieren

Ihr Infomaniak-Hosting muss so konfiguriert werden, dass Laravel die Anfragen an `index.php` weiterleiten kann.

1.  Läuft die Anwendung direkt unter einer eigenen Domain, ändern Sie das "Document Root" (Stammverzeichnis) der Website auf `/path/to/your/project/public`.
2.  Für den Betrieb unter einer Sub-URL wie `app.wrtm.ch/nelius` bleibt Ihr Document-Root i.d.R. auf `~/sites/app.wrtm.ch/public` stehen. Kopieren Sie anschließend nur den Inhalt des Unterordners `public/nelius` aus dem Repository in das Zielverzeichnis auf dem Server:
    ```bash
    rsync -avz --delete public/nelius/ <user>@<host>:~/sites/app.wrtm.ch/public/nelius/
    ```
    Dabei werden ausschließlich die Front-Controller-Dateien (`.htaccess`, `index.php`, `robots.txt`, `favicon.ico`, der gebaute `build/`-Ordner sowie der `storage`-Symlink) in das öffentliche Verzeichnis gelegt. So bleibt der `public`-Ordner aufgeräumt und enthält nur einen einzigen Unterordner `nelius` für die Anwendung.
3.  Nach dem Kopieren führen Sie im Projektordner (`~/sites/app.wrtm.ch/nelius`) einmal `php artisan storage:link` aus. Dadurch entsteht automatisch ein Symlink `~/sites/app.wrtm.ch/public/nelius/storage`, der auf `storage/app/public` im Projekt zeigt.
4.  Stellen Sie sicher, dass die URL-Rewrite-Regeln für Laravel aktiv sind (bei Apache-Hostings übernimmt dies die mitgelieferte `.htaccess`).

### Beispielstruktur auf dem Server

Nach den obigen Schritten sieht die Verzeichnisstruktur typischerweise so aus und entspricht dem von Ihnen gewünschten Aufbau ohne verstreute Dateien:

```
sites/
└── app.wrtm.ch/
    ├── nelius/                  # komplettes Laravel-Projekt (Code, vendor, storage, ...)
    │   ├── .env
    │   ├── artisan
    │   ├── public/
    │   │   └── nelius/          # Quellordner, aus dem Sie deployen
    │   └── ...
    └── public/
        ├── nelius/              # einzig benötigter Ordner im öffentlichen Verzeichnis
        │   ├── .htaccess
        │   ├── index.php
        │   ├── robots.txt
        │   ├── favicon.ico
        │   ├── build/
        │   └── storage -> ../../nelius/storage/app/public
        ├── researchchecker/
        └── die-rationale.ch/
```

## Schritt 5: Ersten Admin-Benutzer erstellen

Nach der Installation sind alle Benutzer normale "user". Um die Admin-Funktionen nutzen zu können, müssen Sie einem Benutzer die Admin-Rolle geben.

1.  Registrieren Sie sich zuerst ganz normal über die Registrierungsseite Ihrer Anwendung.
2.  Verbinden Sie sich per SSH mit dem Server und navigieren Sie zum Projektverzeichnis.
3.  Führen Sie den folgenden Befehl aus, um die Rolle eines Benutzers zu ändern. Ersetzen Sie `user@example.com` durch die E-Mail-Adresse des Benutzers, den Sie zum Admin machen möchten.
    ```bash
    php artisan tinker --execute="\\App\\Models\\User::where('email', 'user@example.com')->update(['role' => 'admin']);"
    ```

Ihre Anwendung sollte nun live und einsatzbereit sein!
