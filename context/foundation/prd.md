---
project: Pet Health PWA
version: 1
status: draft
created: 2026-10-23
context_type: greenfield
product_type: web-app
target_scale:
  users: small
  qps: low
  data_volume: small
timeline_budget:
  mvp_weeks: 3
  hard_deadline: 2026-12-06
  after_hours_only: true
---

# PRD — Pet Health PWA

## Vision & Problem Statement

Właścicielka wielu psów gubi dokumenty i wyniki badań, zapomnia o umówionych wizytach, miesza się dane między różnymi zwierzętami (terminy, przygotowanie do wizyt). Zapomnia o zamówieniu leków i dawkach. Dane są rozproszone na karteczkach i w szufladzie z papierowymi dokumentami.

Skala problemu (wiele zwierząt) oznacza wiele danych do śledzenia, co przekracza możliwości karteczek i pamięci. Aplikacja centralizuje dane o zwierzętach i szczepieniach w jednym miejscu, z automatycznym podpowiadaniem kolejnych szczepień — eliminując rozproszenie i zapominalstwo.

## User & Persona

**Primary persona:** Właściciel kilku psów, który chce dzielić opiekę nad niektórymi psami z innymi osobami, oraz móc opiekować się niektórymi psami innych osób. Używa aplikacji głównie na smartfonie, po godzinach, aby zarządzać profilami zwierząt, szczepieniami i nadchodzącymi terminami.

## Success Criteria

### Primary
Użytkownik może dodać profil psa, dodać szczepienie (z typem i datą), a aplikacja podpowiada zalecaną datę kolejnego szczepienia na podstawie typu — użytkownik potwierdza lub koryguje. Następnie użytkownik widzi wizualny alert o nadchodzących szczepieniach na ekranie głównym.

Przepływ MVP (klik po kliku):
1. Użytkownik otwiera aplikację i loguje się
2. Użytkownik dodaje profil psa (imię, rasa, data urodzenia)
3. Użytkownik dodaje szczepienie (typ, data podania)
4. Aplikacja podpowiada zalecaną datę kolejnego szczepienia
5. Użytkownik potwierdza lub koryguje datę
6. Użytkownik widzi przypomnienie o nadchodzących szczepieniach na ekranie głównym

### Secondary
Możliwość nadania dostępu do konkretnych zwierząt innym użytkownikom (zaproszenie partnera do opieki nad wybranym psem).

### Guardrails
- **Prywatność danych:** Dane o zwierzętach, szczepieniach i lekach są widoczne tylko dla autoryzowanych użytkowników (właściciel + zaproszeni).
- **Działanie offline:** Aplikacja działa przy słabym łączu lub bez internetu (np. w klinice weterynaryjnej) — dane są dostępne lokalnie i synchronizowane po przywróceniu połączenia.

## User Stories

### US-01: Rejestracja i logowanie
- **Given** użytkownik otwiera aplikację po raz pierwszy
- **When** użytkownik podaje dane rejestracyjne (email, hasło)
- **Then** użytkownik jest zarejestrowany i zalogowany
- **And** widzi pusty ekran główny z możliwością dodania pierwszego psa

### US-02: Dodawanie profilu psa
- **Given** użytkownik jest zalogowany
- **When** użytkownik dodaje profil psa (imię, rasa, data urodzenia)
- **Then** profil psa jest zapisany i widoczny na ekranie głównym
- **And** użytkownik może edytować lub usunąć profil

### US-03: Rejestracja szczepienia z przypomnieniem
- **Given** użytkownik jest zalogowany i ma dodany profil psa
- **When** użytkownik dodaje szczepienie (typ i datę podania)
- **Then** aplikacja podpowiada zalecaną datę kolejnego szczepienia na podstawie typu
- **And** użytkownik potwierdza lub koryguje datę
- **And** szczepienie pojawia się na liście nadchodzących szczepień na ekranie szczepień

## Functional Requirements

- FR-001: Użytkownik może zalogować się i zarejestrować w aplikacji. Priority: must-have
  > Socrates: Counter-argument considered: "Dla jednego użytkownika logowanie to niepotrzebne tarcie." Resolution: odrzucono; dwie osoby potrzebują logowania, a przyszłe zaproszenia też.
- FR-002: Użytkownik może dodać, edytować i usunąć profil psa (imię, rasa, data urodzenia). Priority: must-have
  > Socrates: Counter-argument considered: "Edycja i usuwanie to rzadko używane funkcje w MVP." Resolution: odrzucono; psy zmieniają dane, bywają błędy — edycja i usuwanie są potrzebne.
- FR-003: Użytkownik może dodać, edytować i usunąć szczepienie dla psa (typ, data podania, zalecana data kolejnego szczepienia). Priority: must-have
  > Socrates: Counter-argument considered: "Edycja i usuwanie szczepień to rzadko używane funkcje." Resolution: odrzucono; bywają błędy w datach, trzeba poprawić.
- FR-004: Użytkownik może przeglądać nadchodzące szczepienia psa na ekranie głównym. Priority: must-have
  > Socrates: Counter-argument considered: "W MVP wystarczy pokazać tylko nadchodzące szczepienia (przypomnienia). Historia to dodatkowy widok, który można dodać później." Resolution: zawężono do nadchodzących szczepień w MVP; historia przeszłych szczepień w v2.
- FR-005: Właściciel psa może nadać dostęp do konkretnego psa innemu użytkownikowi (zaproszenie). Priority: must-have
  > Socrates: Counter-argument considered: "Zapraszanie innych użytkowników to złożona funkcja. W MVP możecie udostępniać hasło." Resolution: odrzucono; każda osoba ma swoje zwierzęta, których druga nie widzi. Udostępnianie hasła nie rozwiązuje problemu.

## Non-Functional Requirements

- Aplikacja musi działać jako PWA na smartfonie (Chrome/Safari) — instalowalna, dostępna z ekranu głównego.
- Prywatność danych: dane o zwierzętach i szczepieniach są widoczne tylko dla autoryzowanych użytkowników.
- Działanie offline: aplikacja działa przy słabym łączu lub bez internetu — dane są dostępne lokalnie i synchronizowane po przywróceniu połączenia.

## Business Logic

**Reguła:** Aplikacja oblicza zalecaną datę kolejnego szczepienia na podstawie typu szczepienia i harmonogramu weterynaryjnego, a użytkownik potwierdza lub koryguje datę.

**Dane wejściowe:** Typ szczepienia (np. wścieklizna, podstawowe) i data podania szczepienia.
**Wynik:** Zalecana data kolejnego szczepienia (np. +12 miesięcy dla wścieklizny).
**Jak użytkownik napotyka regułę:** Po dodaniu szczepienia aplikacja podpowiada datę; użytkownik widzi ją w formularzu i może potwierdzić lub zmienić.

## Access Control

**Metoda:** Login (email + password / OAuth). Użytkownicy logują się na dowolnym urządzeniu.

**Model uprawnień:** Oparty o zwierzęta. Każda osoba widzi swoje zwierzęta + te, do których została zaproszona przez właściciela. Właściciel zwierzęcia może nadać dostęp innym użytkownikom do konkretnych zwierząt.

**Przykład:** Ty masz 3 psy, partner ma 1 psa. Ty widzisz swoje 3 psy + psa partnera (jeśli Cię zaprosi). Partner widzi swojego psa + Twoje psy (jeśli go zaprosisz do konkretnych).

## Non-Goals

- **Push notifications** — MVP używa wizualnego alertu w aplikacji (lista nadchodzących szczepień). Push notifications można dodać w v2.
- **Wizyty weterynaryjne** — MVP skupia się na szczepieniach. Wizyty (zaplanowane i ad hoc) to osobny moduł w v2.
- **Leki i dawki** — MVP nie zarządza lekami. Przypominanie o zamówieniu leków to v2.
- **Pełna historia szczepień** — MVP pokazuje tylko nadchodzące szczepienia. Przeglądanie przeszłych szczepień to v2.
- **Zdjęcia i dokumenty** — MVP nie przechowuje zdjęć wyników badań ani urazów. To v2.

## Open Questions

1. **Jakie typy szczepień i jakie są ich interwały?** — Konkretny harmonogram weterynaryjny do zaimplementowania w regule biznesowej (np. wścieklizna = 12 miesięcy, podstawowe = 12 miesięcy). Owner: użytkownik. Block: nie (MVP może zacząć od domyślnego interwału 12 miesięcy).
2. **Czy są szczepienia z innym interwałem niż 12 miesięcy?** — Np. 6 miesięcy, 3 lata. Owner: użytkownik. Block: nie (może poczekać na v2, jeśli nie są krytyczne).
