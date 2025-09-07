# Data Models & API Specifications

This document outlines the data models and API requirements for the DiamondPrice Compass backend implementation.

## Database Schema

### User Entity
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email_verified BOOLEAN DEFAULT FALSE,
  subscription_status VARCHAR(50) DEFAULT 'free', -- 'free', 'single_report', 'unlimited'
  subscription_id VARCHAR(255), -- Stripe subscription ID
  customer_id VARCHAR(255), -- Stripe customer ID
  subscription_expiry TIMESTAMP,
  reports_remaining INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### DiamondListing Entity
```sql
CREATE TABLE diamond_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  listing_url TEXT,
  sku VARCHAR(100),
  photo_cdn_url TEXT,
  ipfs_hash VARCHAR(100),
  carat DECIMAL(4,2),
  cut VARCHAR(50),
  color VARCHAR(10),
  clarity VARCHAR(10),
  measurements VARCHAR(100),
  inclusions TEXT,
  certificate VARCHAR(100),
  listing_price DECIMAL(10,2),
  valuation DECIMAL(10,2),
  is_overpriced BOOLEAN DEFAULT FALSE,
  ethical_sourcing_status VARCHAR(50),
  upload_timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### MarketData Entity
```sql
CREATE TABLE market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diamond_spec_hash VARCHAR(100) UNIQUE NOT NULL, -- Hash of carat+cut+color+clarity
  carat_range VARCHAR(20), -- e.g., "1.0-1.1"
  cut VARCHAR(50),
  color VARCHAR(10),
  clarity VARCHAR(10),
  average_price DECIMAL(10,2),
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  sample_size INTEGER,
  price_trend VARCHAR(20), -- 'up', 'down', 'stable'
  historical_trend JSONB,
  data_source VARCHAR(100),
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Valuations Entity
```sql
CREATE TABLE valuations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  listing_id UUID REFERENCES diamond_listings(id),
  fair_market_value DECIMAL(10,2),
  quality_grade VARCHAR(50),
  is_overpriced BOOLEAN,
  price_range_min DECIMAL(10,2),
  price_range_max DECIMAL(10,2),
  market_comparison VARCHAR(100),
  negotiation_points JSONB,
  ethical_sourcing JSONB,
  confidence_score INTEGER,
  ai_analysis JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Subscriptions Entity
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  plan_type VARCHAR(50), -- 'single_report', 'unlimited'
  status VARCHAR(50), -- 'active', 'canceled', 'past_due', 'unpaid'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "emailVerified": false,
    "subscriptionStatus": "free"
  },
  "token": "jwt_token",
  "refreshToken": "refresh_token"
}
```

#### POST /api/auth/login
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### GET /api/auth/me
Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "subscriptionStatus": "unlimited",
    "subscriptionExpiry": "2024-12-31T23:59:59Z"
  }
}
```

### Diamond Valuation Endpoints

#### POST /api/valuations
```json
{
  "diamondSpecs": {
    "carat": 1.5,
    "cut": "Round",
    "color": "G",
    "clarity": "VS1",
    "measurements": "7.35 x 7.38 x 4.56 mm",
    "certificate": "GIA-1234567890",
    "listingPrice": 8500,
    "listingUrl": "https://example.com/diamond"
  }
}
```

Response:
```json
{
  "success": true,
  "valuation": {
    "id": "uuid",
    "fairMarketValue": 7800,
    "qualityGrade": "Excellent",
    "isOverpriced": true,
    "priceRange": {
      "min": 7200,
      "max": 8400
    },
    "marketComparison": "Above market average",
    "negotiationPoints": [
      "This diamond is priced 9% above fair market value",
      "G color grade may show slight tinting in certain lighting"
    ],
    "ethicalSourcing": {
      "verified": true,
      "origin": "Certified Lab-Grown",
      "certificate": "GIA-1234567890"
    },
    "confidence": 92,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### GET /api/valuations
Headers: `Authorization: Bearer <token>`

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### Market Data Endpoints

#### POST /api/market-data/query
```json
{
  "carat": 1.5,
  "cut": "Round",
  "color": "G",
  "clarity": "VS1"
}
```

Response:
```json
{
  "success": true,
  "marketData": {
    "averagePrice": 7800,
    "priceRange": {
      "min": 7200,
      "max": 8400
    },
    "sampleSize": 45,
    "trend": "stable",
    "historicalData": [
      {"month": "2024-01", "averagePrice": 7750},
      {"month": "2024-02", "averagePrice": 7800}
    ],
    "lastUpdated": "2024-01-15T08:00:00Z"
  }
}
```

### Payment Endpoints

#### POST /api/create-checkout-session
```json
{
  "planType": "unlimited",
  "mode": "subscription",
  "successUrl": "https://app.com/success",
  "cancelUrl": "https://app.com/pricing"
}
```

Response:
```json
{
  "success": true,
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

#### POST /api/webhooks/stripe
Stripe webhook endpoint for handling subscription events.

#### GET /api/subscription-status/:customerId
Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true,
  "subscription": {
    "id": "sub_...",
    "status": "active",
    "planType": "unlimited",
    "currentPeriodEnd": "2024-02-15T10:30:00Z",
    "cancelAtPeriodEnd": false
  }
}
```

## Environment Variables (Backend)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/diamond_compass

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Email (SendGrid/SES)
EMAIL_API_KEY=your_email_api_key
FROM_EMAIL=noreply@diamondpricecompass.com

# Redis (for caching)
REDIS_URL=redis://localhost:6379

# File Storage
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
S3_BUCKET_NAME=diamond-compass-files

# External APIs
DIAMOND_DATA_API_KEY=your_diamond_data_api_key
BLOCKCHAIN_API_KEY=your_blockchain_api_key
```

## Business Logic Requirements

### Diamond Valuation Algorithm
1. **Base Price Calculation**: Use industry-standard 4C pricing formulas
2. **Market Data Integration**: Adjust prices based on current market conditions
3. **Lab-Grown Discount**: Apply 20-40% discount compared to natural diamonds
4. **Quality Assessment**: Score based on cut, color, clarity, carat combination
5. **Overpricing Detection**: Flag listings >15% above fair market value

### Subscription Management
1. **Free Tier**: No valuations, view pricing only
2. **Single Report**: $29, one-time purchase, 1 valuation
3. **Unlimited**: $99/month, unlimited valuations + premium features
4. **Grace Period**: 3 days past due before access restriction
5. **Cancellation**: Immediate cancellation, access until period end

### AI Integration Points
1. **Image Analysis**: Extract diamond specs from photos/certificates
2. **Negotiation Scripts**: Generate personalized negotiation strategies
3. **Market Analysis**: Analyze trends and provide insights
4. **Quality Assessment**: AI-powered quality grading assistance

### Security Requirements
1. **Authentication**: JWT with refresh tokens
2. **Rate Limiting**: API rate limits per user/IP
3. **Data Encryption**: Encrypt sensitive data at rest
4. **PCI Compliance**: For payment processing
5. **GDPR Compliance**: User data protection and deletion rights

### Performance Requirements
1. **Response Time**: <2s for valuations, <500ms for market data
2. **Caching**: Redis for market data and frequent queries
3. **Database Indexing**: Optimize for common query patterns
4. **CDN**: Static assets and images
5. **Monitoring**: Application performance monitoring

## Integration Requirements

### Stripe Webhooks
Handle these webhook events:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### External Data Sources
1. **Diamond Market APIs**: Real-time pricing data
2. **Certification APIs**: Verify diamond certificates
3. **Blockchain APIs**: Ethical sourcing verification
4. **Email Service**: Transactional emails
5. **Analytics**: User behavior tracking

This specification provides the foundation for implementing a production-ready backend for the DiamondPrice Compass application.
