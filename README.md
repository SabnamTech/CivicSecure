# 🚨 CivicSecure
**Reliable Citizen Grievance & Safety Platform**

CivicSecure is a lightweight, always-on grievance redressal app that ensures citizens can file complaints and safety alerts **anytime, anywhere — even when official apps fail**.  
Built with **React + Node.js + PostgreSQL**, it focuses on **reliability, anonymity, and transparency**.

---

## ✨ Key Features
- **Offline Queuing** → File complaints without internet, auto-sync later.  
- **Multi-Channel Access** → Mobile App + SMS + WhatsApp fallback.  
- **Anonymity by Choice** → Report safely without fear.  
- **Tamper-Proof Logs** → Immutable audit trail + NGO oversight.  
- **Future: DigiLocker Integration** → Attach verified govt documents easily.  

---

## 🎯 Why CivicSecure?
Government service apps (like AP Police Seva) often go down, leaving citizens without access to essential services.  
CivicSecure provides a **resilient, independent, and citizen-first platform** that protects against corruption and ensures accountability — complementing the **Digital India** mission.  

---

## 🛠️ Tech Stack
- **Frontend:** React  
- **Backend:** Node.js (Express/Fastify)  
- **Database:** PostgreSQL (with Prisma/Sequelize ORM)  
- **Storage:** Cloud storage (e.g., Firebase / S3) → video & images stored here, DB only keeps URLs  
- **Messaging:** SMS Gateway, WhatsApp Business API  
- **Security:** End-to-End Encryption, Immutable Logs  

---

## 🗂 Database Schema (MVP)

### complaints
| Column         | Type        | Notes                                    |
|----------------|-------------|------------------------------------------|
| id             | UUID (PK)   | Unique complaint ID                      |
| created_at     | TIMESTAMP   | Auto-generated                           |
| category       | ENUM        | safety, theft, civic, etc.               |
| description    | TEXT        | Complaint details                        |
| attachments    | JSONB       | Array of file URLs                       |
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

---

## 🚀 Roadmap
- [ ] Complaint filing with offline queue  
- [ ] SMS/WhatsApp fallback  
- [ ] Status tracking dashboard  
- [ ] NGO oversight & tamper-proof logs  
- [ ] DigiLocker integration  

---

## 📸 Demo (Coming Soon)
Screenshots / GIFs will be added after prototype build.  

---

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.  

---

## 📜 License
MIT License © 2025 CivicSecure Team
