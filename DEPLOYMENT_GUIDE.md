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
2.  Navigieren Sie in das Verzeichnis, in dem Ihre Websites liegen (oft `~/web` oder `~/public_html`).
3.  Klonen Sie das Projekt-Repository auf den Server:
    ```bash
    git clone <repository_url> time-master
    ```
4.  Wechseln Sie in das Projektverzeichnis:
    ```bash
    cd time-master
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
4.  **Setzen Sie die `APP_URL`:** Tragen Sie die endgültige URL Ihrer Anwendung ein (z.B. `https://timemaster.ihredomain.ch`).
5.  **Generieren Sie einen App-Schlüssel:** Führen Sie diesen Befehl aus, um die Anwendung zu sichern.
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

## Schritt 4: Webserver-Konfiguration

Ihr Infomaniak-Hosting muss so konfiguriert werden, dass es auf das `public`-Verzeichnis innerhalb Ihres `time-master`-Projektordners zeigt.

1.  Gehen Sie in Ihrem Infomaniak-Admin-Panel zu den Einstellungen Ihrer Domain/Website.
2.  Ändern Sie das "Document Root" (Stammverzeichnis) der Website. Es sollte auf den Pfad `/path/to/your/project/time-master/public` zeigen.
3.  Stellen Sie sicher, dass die URL-Rewrite-Regeln für Laravel aktiv sind (normalerweise ist dies bei Apache-Hostings mit der mitgelieferten `.htaccess`-Datei automatisch der Fall).

## Schritt 5: Ersten Admin-Benutzer erstellen

Nach der Installation sind alle Benutzer normale "user". Um die Admin-Funktionen nutzen zu können, müssen Sie einem Benutzer die Admin-Rolle geben.

1.  Registrieren Sie sich zuerst ganz normal über die Registrierungsseite Ihrer Anwendung.
2.  Verbinden Sie sich per SSH mit dem Server und navigieren Sie zum Projektverzeichnis.
3.  Führen Sie den folgenden Befehl aus, um die Rolle eines Benutzers zu ändern. Ersetzen Sie `user@example.com` durch die E-Mail-Adresse des Benutzers, den Sie zum Admin machen möchten.
    ```bash
    php artisan tinker --execute="\\App\\Models\\User::where('email', 'user@example.com')->update(['role' => 'admin']);"
    ```

Ihre Anwendung sollte nun live und einsatzbereit sein!
