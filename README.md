# Zadanie 2 – GitHub Actions Pipeline

## Autor

Oleksandr Pyrlyk

## Opis projektu

Projekt został wykonany w ramach przedmiotu **Programowanie Aplikacji w Chmurze Obliczeniowej**.

Celem zadania było przygotowanie łańcucha GitHub Actions, który automatycznie buduje obraz kontenera Docker na podstawie aplikacji opracowanej w Zadaniu 1, wykonuje test bezpieczeństwa CVE oraz publikuje obraz w GitHub Container Registry.

---

## Wykorzystane technologie

* Node.js
* Express.js
* Docker
* Docker Buildx
* QEMU
* GitHub Actions
* GitHub Container Registry (GHCR)
* DockerHub Registry Cache
* Trivy Security Scanner

---

## Funkcjonalność pipeline

Pipeline wykonuje następujące kroki:

1. Pobranie kodu źródłowego z repozytorium GitHub.
2. Konfiguracja środowiska Buildx.
3. Konfiguracja emulatora QEMU.
4. Logowanie do DockerHub.
5. Logowanie do GitHub Container Registry.
6. Budowanie obrazu Docker.
7. Wykonanie skanowania bezpieczeństwa za pomocą Trivy.
8. Budowanie obrazu wieloarchitekturowego.
9. Publikacja obrazu do GHCR.

---

## Obsługiwane architektury

Budowany obraz wspiera:

* linux/amd64
* linux/arm64

Do realizacji wieloplatformowego budowania wykorzystano:

* Docker Buildx
* QEMU

---

## Mechanizm cache

W celu przyspieszenia kolejnych procesów budowania zastosowano cache BuildKit.

Cache przechowywany jest w publicznym repozytorium DockerHub.

W pipeline wykorzystano:

```yaml
cache-from: type=registry
cache-to: type=registry,mode=max
```

Tryb `mode=max` umożliwia przechowywanie pełnych warstw cache, co znacząco skraca czas kolejnych buildów.

---

## Test bezpieczeństwa CVE

Do analizy bezpieczeństwa obrazu wykorzystano narzędzie **Trivy**.

Pipeline został skonfigurowany tak, aby:

* wykrywać podatności HIGH,
* wykrywać podatności CRITICAL,
* blokować publikację obrazu, jeśli zostaną znalezione podatności o wskazanym poziomie.

Dzięki temu do repozytorium obrazów trafiają wyłącznie obrazy spełniające wymagania bezpieczeństwa.

---

## Schemat tagowania obrazów

Obrazy publikowane są z wykorzystaniem dwóch tagów:

### latest

Oznacza najnowszą stabilną wersję obrazu.

### github.sha

Tag odpowiada identyfikatorowi konkretnego commita Git.

Pozwala jednoznacznie określić wersję kodu źródłowego, z której został zbudowany obraz.

Przykład:

```text
ghcr.io/OleksandrPyrlyk/zadanie1-chmura-weather:latest

ghcr.io/OleksandrPyrlyk/zadanie1-chmura-weather:<github_sha>
```

---

## GitHub Container Registry

Docelowe repozytorium obrazu:

```text
ghcr.io/OleksandrPyrlyk/zadanie1-chmura-weather
```

---

## Struktura repozytorium

```text
.github/
└── workflows/
    └── docker-publish.yml

Dockerfile
README.md
package.json
package-lock.json
server.js
public/
```

---

## Uruchamianie workflow

Workflow uruchamia się automatycznie po wykonaniu:

```bash
git push
```

do gałęzi:

```text
main
```

Możliwe jest również ręczne uruchomienie z poziomu zakładki GitHub Actions.

---

## Wynik

Pipeline został pomyślnie uruchomiony w GitHub Actions.

Zrealizowano wszystkie wymagania zadania:

* budowanie obrazu Docker,
* obsługa linux/amd64,
* obsługa linux/arm64,
* wykorzystanie cache registry,
* test CVE przy użyciu Trivy,
* publikacja obrazu do GHCR.
