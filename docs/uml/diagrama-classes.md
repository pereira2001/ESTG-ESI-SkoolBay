# Diagrama de Classes — SkoolBay

> Engenharia de Software I — Instituto Piaget, 2025/2026

---

## Diagrama

```mermaid
classDiagram
    class User {
        +String id
        +String name
        +String email
        +String passwordHash
        +String university
        +String course
        +String bio
        +String avatarUrl
        +Float rating
        +Role role
        +Boolean emailVerified
        +DateTime createdAt
        +register()
        +login()
        +updateProfile()
        +calculateRating()
    }

    class Service {
        +String id
        +String title
        +String description
        +Float price
        +Boolean isActive
        +DateTime createdAt
        +String userId
        +String categoryId
        +publish()
        +edit()
        +remove()
    }

    class ServiceRequest {
        +String id
        +String message
        +RequestStatus status
        +DateTime createdAt
        +String serviceId
        +String buyerId
        +accept()
        +reject()
        +complete()
        +cancel()
    }

    class Review {
        +String id
        +Int rating
        +String comment
        +DateTime createdAt
        +String requestId
        +submit()
    }

    class Category {
        +String id
        +String name
        +String slug
        +String icon
    }

    class Report {
        +String id
        +TargetType targetType
        +String targetId
        +String reason
        +ReportStatus status
        +DateTime createdAt
        +String reporterId
        +submit()
        +resolve()
        +dismiss()
    }

    class Role {
        <<enumeration>>
        USER
        ADMIN
    }

    class RequestStatus {
        <<enumeration>>
        PENDING
        ACCEPTED
        REJECTED
        COMPLETED
        CANCELLED
    }

    class ReportStatus {
        <<enumeration>>
        PENDING
        RESOLVED
        DISMISSED
    }

    class TargetType {
        <<enumeration>>
        SERVICE
        USER
    }

    %% Relações
    User "1" --> "0..*" Service : publica
    User "1" --> "0..*" ServiceRequest : envia como buyer
    User "1" --> "0..*" Report : submete
    Service "1" --> "0..*" ServiceRequest : recebe
    Service "0..*" --> "1" Category : pertence a
    ServiceRequest "1" --> "0..1" Review : origina
    User --> Role : tem
    ServiceRequest --> RequestStatus : tem
    Report --> ReportStatus : tem
    Report --> TargetType : tem
```

---

## Descrição das Entidades

### User
Representa um estudante registado na plataforma. Pode desempenhar o papel de Prestador (publica serviços) e/ou Cliente (envia pedidos). O campo `role` distingue utilizadores normais de administradores. O `rating` é calculado automaticamente com base nas reviews recebidas.

### Service
Serviço publicado por um Prestador. Tem um estado ativo/inativo (`isActive`) — a remoção é um soft delete. Pertence a uma `Category` e está associado ao `User` que o criou via `userId`.

### ServiceRequest
Pedido enviado por um Cliente para um Serviço. Segue uma máquina de estados definida pelo enum `RequestStatus`. O `buyerId` referencia o `User` que fez o pedido.

### Review
Avaliação deixada pelo Cliente após um pedido concluído. Existe no máximo uma `Review` por `ServiceRequest`. O `rating` (1-5) é usado para recalcular o `User.rating` do prestador.

### Category
Categorias pré-definidas para organizar os serviços (ex: Tecnologia, Idiomas, Design). Cada serviço pertence a uma categoria.

### Report
Denúncia submetida por um estudante contra um serviço ou utilizador. O campo `targetType` indica o alvo. Gerida pelo Administrador através do painel de moderação.

---

## Máquina de Estados — ServiceRequest

```mermaid
stateDiagram-v2
    [*] --> PENDING : Cliente envia pedido
    PENDING --> ACCEPTED : Prestador aceita
    PENDING --> REJECTED : Prestador recusa
    PENDING --> CANCELLED : Cliente cancela
    ACCEPTED --> COMPLETED : Prestador conclui
    ACCEPTED --> CANCELLED : Cliente cancela
    COMPLETED --> [*]
    REJECTED --> [*]
    CANCELLED --> [*]
```
