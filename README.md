# 🚨 CivicSecure
**Citizen Information & Grievance Hub**

CivicSecure is a resilient, always-on platform that empowers citizens to:  
- Access **verified government info & disaster alerts**  
- File **complaints and grievances** safely  
- Get **chat/call support** from NGOs or call centers  
- Participate in **community discussion channels**  
- Ensure **genuine reporting** through optional Aadhaar verification  
- Attach **verified documents via DigiLocker**  

Built with **React + Node.js + Firebase + PostgreSQL**, CivicSecure focuses on **reliability, transparency, and citizen-first solutions**.

---

## ✨ Key Features

### 1. Information Hub
- Govt-verified info, schemes, and benefits  
- Real-time disaster alerts (flood, earthquake, power outage)  
- Categorized: Schemes | Safety Alerts | Health | Disaster Updates  

### 2. Grievance/Complaint Module
- File complaints **online, offline, or via SMS/WhatsApp**  
- Anonymous or Aadhaar-verified options  
- Status tracking (Submitted → In Review → Resolved)  
- Immutable audit logs for transparency  

### 3. Chat & Call Support
- Citizen ↔ NGO / Call Center communication  
- AI-assisted FAQ support  
- Human escalation for urgent cases  

### 4. Community Channels
- Topic-based discussion threads (Women’s Safety, Civic Issues, Disaster Alerts, Schemes)  
- Verified (Aadhaar) vs Anonymous posts  
- NGO moderation + AI filtering for safety and spam  
- Direct complaint filing from threads  

### 5. Aadhaar Verification (Optional)
- Aadhaar or VID-based verification for trust and authenticity  
- Verified complaints marked as credible for faster action  
- Anonymous mode still available for citizen safety  

### 6. DigiLocker Integration (Future Phase)
- Simplified interface for attaching verified government documents  
- OAuth / VID login for secure access  
- Files stored in Firebase Storage; links stored in complaint record  
- Offline fallback for manual attachment if DigiLocker is unavailable  

### 7. AI Roadmap
- Detect spam or duplicate complaints  
- Prioritize urgent issues (emergency classification)  
- Moderate chat/images/videos automatically  
- Highlight trending topics for NGOs and authorities  

---

## 🛠 Tech Stack
- **Frontend:** React (web + PWA) → future Flutter mobile app  
- **Backend:** Node.js (Express/Fastify)  
- **Database:** PostgreSQL (structured complaints + audit logs)  
- **Realtime Data & Storage:** Firebase (chat, info hub, images/videos)  
- **Push Notifications:** Firebase Cloud Messaging  
- **Security:** End-to-End Encryption, Immutable Logs  

---

## 🔹 Frontend Strategy
- **Phase 1:** React Web MVP for fast prototyping and hackathon demo  
- **Phase 2:** Flutter Mobile App for iOS & Android, offline-first experience, and native push notifications  

---

## 🗂 Database Schema (MVP)

### complaints
| Column         | Type        | Notes                                    |
|----------------|-------------|------------------------------------------|
| id             | UUID (PK)   | Unique complaint ID                      |
| created_at     | TIMESTAMP   | Auto-generated                           |
| category       | ENUM        | safety, theft, civic, disaster, etc.    |
| description    | TEXT        | Complaint details                        |
| attachments    | JSONB       | Array of Firebase file URLs              |
| location       | TEXT        | GPS or address                           |
| reporter_type  | ENUM        | anonymous / pseudonymous / verified      |
| status         | ENUM        | submitted / forwarded / resolved         |

### complaint_status_log
| Column       | Type        | Notes                                    |
|--------------|-------------|------------------------------------------|
| id           | UUID (PK)   | Unique log entry                         |
| complaint_id | UUID (FK)   | Links to complaints                      |
| status       | ENUM        | Current status                           |
| changed_by   | TEXT        | NGO / system / govt officer              |
| timestamp    | TIMESTAMP   | Auto-generated                           |

### users
| Column             | Type        | Notes                                    |
|-------------------|-------------|------------------------------------------|
| id                 | UUID (PK)   | User ID                                  |
| aadhaar_verified   | BOOLEAN     | True if verified via Aadhaar             |
| aadhaar_reference  | TEXT        | Masked Aadhaar / UIDAI token             |
| created_at         | TIMESTAMP   | Registration date                         |

### info_hub (Firebase)
| Field       | Type        | Notes                                      |
|-------------|-------------|--------------------------------------------|
| id          | Auto-ID     | Unique ID                                  |
| title       | String      | Title of info or alert                     |
| type        | Enum        | govt_scheme / disaster_alert / general_info |
| content     | Text        | Description / instructions                 |
| source      | Enum        | govt / NGO                                 |
| created_at  | Timestamp   | Date of creation                           |
| valid_till  | Timestamp   | Expiry for alerts                           |

### chats (Firebase)
| Field           | Type        | Notes                                    |
|-----------------|-------------|------------------------------------------|
| chat_id         | Auto-ID     | Unique chat thread                        |
| user_id         | UUID        | Optional, can be anonymous               |
| messages        | Array       | sender, timestamp, content               |
| status          | Enum        | open / escalated_to_callcenter / closed  |
| assigned_agent  | String      | Agent handling chat (nullable)           |

---

## 🚀 Roadmap
- [ ] Phase 1: React Web MVP  
  - Information Hub + Disaster Alerts  
  - Complaint Module (offline + SMS/WhatsApp)  
  - Chat & FAQ bot  
  - Community discussion channels  
  - Aadhaar verification + document upload (DigiLocker)  
- [ ] Phase 2: Flutter Mobile App  
  - Full mobile experience  
  - Offline-first syncing  
  - Push notifications + alerts  
- [ ] Phase 3: AI-assisted genuineness & priority checking  

---

## 📸 Demo (Coming Soon)
Screenshots / GIFs will be added after prototype build.  

---

## 🤝 Contributing
Pull requests are welcome. For major changes, open an issue first to discuss.  

---

## 📜 License
MIT License © 2025 CivicSecure Team
