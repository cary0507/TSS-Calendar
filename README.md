# 📅 TSS Calendar (App Club)

A school-wide events platform built by App Club to centralize, organize, and distribute all academic and student-life events into a single unified system used by students and staff.

This is the **frontend application built with Angular**, powered by **Firebase Firestore** and **Firebase Authentication**, and connected to a separate Java backend service for extended backend logic.

---

## 📌 Overview

TSS Calendar was built to solve a real operational problem in schools: important events were fragmented across multiple communication channels, leading to missed deadlines, confusion, and lack of visibility.

This application consolidates all events into a structured system that allows students to:
- View upcoming events in real time
- Browse events by category
- Explore a monthly calendar view
- Receive reminders for important activities

It is actively used within the school environment as a production internal tool.

---

## ✨ Features

### 📌 Events Feed (Homepage)
- Scrollable feed of all upcoming events
- Automatically categorized:
  - Academics
  - Student Life
  - Sports
  - Competitions
  - Performances
  - School Announcements
- Each event includes:
  - Title
  - Date & time
  - Category
  - Description
  - Optional image
  - “Notify Me” action

---

### 📆 Calendar View
- Monthly calendar layout similar to Google Calendar
- Events displayed on correct dates
- Color-coded categories
- Click-to-open event details

---

### 📄 Event Details
- Full event information view
- Description, date, time, category
- Optional image
- Notification/reminder option

---

### 🔔 Notifications
- “Notify Me” system for event reminders
- Email-based notifications (V1)
- No user login required for basic event viewing

---

### 🧾 Event Submission System
- Google Form-based submission pipeline
- All submissions are reviewed by App Club
- Approved events are manually added to Firestore
- Ensures controlled, spam-free event management

---

### 🛠 Admin Panel
- Internal tool for App Club executives
- Create, edit, and delete events
- Maintain event accuracy and updates

---

## 🧠 System Architecture

Google Form Submission
        ↓
App Club Review
        ↓
Firebase Firestore Database
        ↓
Angular Frontend (TSS Calendar)
        ↓
Firebase Authentication (Admin Access)
        ↓
Notification System (Email / Future Expansion)
