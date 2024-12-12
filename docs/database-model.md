# Database Model Documentation

## Core Models

### User Management
- **User**: Core user entity with basic info and role management
  - Relations: Emails, Projects (as admin/member), Departments (as HoD)
  - Current implementation covers basic needs
  - Future: Consider adding Profile model for extended user info

### Project Structure
- **Project**: Central entity for film productions
  - Current: Basic project info with status management
  - Relations: Admin, Members, Departments, Calendar, Scripts, Schedules
  - Good foundation for core functionality

### Role & Permission System
- **ProjectMember**: Handles user roles within projects
  - Flexible role system (ADMIN, HOD, MEMBER, VIEWER)
  - Department assignment capability
  - Permission granularity through ProjectPermission model

### Department Management
- **Department**: Organizes project teams
  - Head of Department (HoD) assignment
  - Member management through ProjectMember relation

## Planned Extensions

### Phase 1 (Current Schema)
- Calendar & Events
- Scripts with versioning
- Basic scheduling

### Phase 2 (Future)
1. **Cast & Crew Management**
   ```prisma
   model CastMember {
     id          String   @id @default(cuid())
     projectId   String
     project     Project  @relation(fields: [projectId], references: [id])
     name        String
     role        String
     contactInfo Json?
     availability Json?
   }
   ```

2. **Resource Management**
   ```prisma
   model Equipment {
     id          String   @id @default(cuid())
     name        String
     category    String
     status      String
     projectId   String?
     project     Project? @relation(fields: [projectId], references: [id])
   }
   ```

### Phase 3 (Future)
- Budget tracking
- Location management
- Detailed call sheets
- File management with versioning

## Notes
- Current schema provides solid foundation
- Modular design allows incremental expansion
- Focus on core functionality first
- Consider performance implications for future scaling 