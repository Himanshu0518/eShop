# 🔧 Quick Fix Script for Service Files

## Update these files manually or run find-replace:

### **Files to update:**
- `client/src/services/cart.services.ts`
- `client/src/services/favourites.services.ts`
- `client/src/services/order.services.ts`
- `client/src/services/user.services.ts`

### **Change 1: Add import**
Add at the top:
```typescript
import { API_BASE_URL } from '@/lib/api-config';
```

### **Change 2: Update baseQuery**
Find:
```typescript
baseQuery: fetchBaseQuery({
    baseUrl: "/api",
```

Replace with:
```typescript
baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
```

---

## OR use this PowerShell script:

```powershell
$files = @(
    "C:\Users\hs787\Desktop\eShop\client\src\services\cart.services.ts",
    "C:\Users\hs787\Desktop\eShop\client\src\services\favourites.services.ts",
    "C:\Users\hs787\Desktop\eShop\client\src\services\order.services.ts",
    "C:\Users\hs787\Desktop\eShop\client\src\services\user.services.ts"
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    
    # Add import if not exists
    if ($content -notmatch "import.*API_BASE_URL") {
        $content = $content -replace "(import { createApi, fetchBaseQuery }", "`$1 } from '@reduxjs/toolkit/query/react';`nimport { API_BASE_URL } from '@/lib/api-config';`n`nimport"
    }
    
    # Replace baseUrl
    $content = $content -replace 'baseUrl: "/api"', 'baseUrl: API_BASE_URL'
    
    Set-Content $file $content
}

Write-Host "✅ All service files updated!"
```

Save as `update-services.ps1` and run:
```powershell
cd C:\Users\hs787\Desktop\eShop
.\update-services.ps1
```
