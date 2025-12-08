# Low-Level System Design

## Table of Contents
1. [Frontend System Design](#frontend-system-design)
2. [Backend System Design](#backend-system-design)
3. [Component Interactions](#component-interactions)
4. [State Management](#state-management)
5. [Error Handling](#error-handling)

---

## Frontend System Design

### HTML Structure Hierarchy

```mermaid
graph TD
    HTML["<html>"]
    
    HEAD["<head>"]
    BODY["<body>"]
    
    HTML --> HEAD
    HTML --> BODY
    
    HEAD --> META["Meta Tags<br/>(Charset, Viewport)"]
    HEAD --> TITLE["Title Tag"]
    HEAD --> CSS["Link to CSS"]
    
    BODY --> BGCONTAINER["Background Container<br/>id: backgroundContainer"]
    BODY --> THEMETOGGLE["Theme Toggle Button<br/>id: themeToggle"]
    BODY --> CONTAINER["Main Container<br/>class: container"]
    BODY --> SCRIPT["Script Tag"]
    
    CONTAINER --> TITLE_H1["<h1>Title</h1>"]
    CONTAINER --> FORM["<form id: predictionForm>"]
    CONTAINER --> RESULT["<div id: result>"]
    
    FORM --> AGE["Age Input"]
    FORM --> GENDERROW["Gender & Pregnancies Row"]
    FORM --> GLUCOSE["Glucose Input"]
    FORM --> BP["Blood Pressure Input"]
    FORM --> SKIN["Skin Thickness Input"]
    FORM --> INSULIN["Insulin Input"]
    FORM --> BMI["BMI Input"]
    FORM --> PEDIGREE["Pedigree Input"]
    FORM --> BUTTON["Submit Button"]
    
    GENDERROW --> GENDERFIELD["Gender Select"]
    GENDERROW --> PREGNANCYFIELD["Pregnancies Select<br/>Hidden by default"]
    
    style HTML fill:#e3f2fd
    style FORM fill:#fff3e0
    style CONTAINER fill:#f3e5f5
```

### CSS Architecture

#### 1. **CSS Variables (Theme System)**
```css
:root {
  --primary-color: #3498db;
  --primary-hover: #2980b9;
  --text-color: #2c3e50;
  --bg-overlay: rgba(255, 255, 255, 0.15);
  --glass-border: rgba(255, 255, 255, 0.2);
}

body.dark-theme {
  --text-color: #ecf0f1;
  --bg-overlay: rgba(0, 0, 0, 0.3);
  --glass-border: rgba(255, 255, 255, 0.1);
}
```

#### 2. **Glass Morphism Implementation**
```
.container {
  background: var(--bg-overlay);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
}
```

**Key Properties:**
- `backdrop-filter: blur(20px)` - Creates glass effect
- `background: rgba(...)` - Semi-transparent color
- `border: 1px solid rgba(...)` - Subtle border
- Fallback for older browsers using `-webkit-` prefix

#### 3. **Animation System**

```mermaid
graph LR
    A["Page Load"] -->|containerSlideIn| B["Slide & Fade<br/>0.5s"]
    B -->|Display| C["Form Ready"]
    
    D["Background Change"] -->|backgroundFade| E["Fade In<br/>1s"]
    E -->|Display| F["New Wallpaper"]
    
    G["Result Display"] -->|resultSlideIn| H["Slide Up & Fade<br/>0.3s"]
    H -->|Display| I["Show Result"]
    
    style A fill:#fff9c4
    style C fill:#c8e6c9
    style D fill:#fff9c4
    style F fill:#c8e6c9
    style G fill:#fff9c4
    style I fill:#c8e6c9
```

### JavaScript Module Structure

```mermaid
graph TB
    subgraph ThemeSystem["Theme Management"]
        InitTheme["initializeTheme()"]
        ThemeToggle["Theme Toggle Handler"]
        LocalStorage["LocalStorage Persistence"]
    end
    
    subgraph BgSystem["Background System"]
        LoadBg["changeBackground()"]
        GetRandom["getRandomBackground()"]
        Timer["setupBackgroundTimer()"]
    end
    
    subgraph HealthSystem["Health Ranges System"]
        LoadData["loadHealthRanges()"]
        GetRange["getHealthRangeForAge()"]
        UpdatePlaceholder["updateHealthPlaceholders()"]
    end
    
    subgraph GenderSystem["Gender System"]
        GenderListener["Gender Change Handler"]
        ShowPregnancy["Show/Hide Pregnancy Field"]
        SetDefault["Set Default Value 0"]
    end
    
    subgraph APISystem["API Integration"]
        FormListener["Form Submit Handler"]
        FetchAPI["Fetch API Call"]
        ProcessResult["Process Response"]
        DisplayResult["Display Prediction"]
    end
    
    style ThemeSystem fill:#e1f5ff
    style BgSystem fill:#e1f5ff
    style HealthSystem fill:#f3e5f5
    style GenderSystem fill:#fff3e0
    style APISystem fill:#fce4ec
```

---

## Backend System Design

### Flask Application Architecture

```mermaid
graph TD
    Request["HTTP Request<br/>POST /predict"]
    
    Flask["Flask App<br/>(app.py)"]
    Request -->|Route Handling| Flask
    
    Validation["Input Validation<br/>- Range Check<br/>- Type Check<br/>- Required Fields"]
    Flask -->|Validate| Validation
    
    FeatureExtraction["Feature Extraction<br/>Create 8-D Vector"]
    Validation -->|Valid| FeatureExtraction
    Validation -->|Invalid| ErrorResponse["Error Response<br/>400 Bad Request"]
    
    Scaling["Feature Scaling<br/>Normalize Values"]
    FeatureExtraction -->|Scale| Scaling
    
    Model["ML Model<br/>Load from Pickle"]
    Scaling -->|Features| Model
    
    Predict["Model Predict<br/>score = model.predict()"]
    Model -->|Process| Predict
    
    Confidence["Confidence Score<br/>Calculate Probability"]
    Predict -->|Score| Confidence
    
    Response["JSON Response<br/>with Prediction<br/>& Confidence"]
    Confidence -->|Format| Response
    
    Return["Return to Client"]
    Response -->|Send| Return
    ErrorResponse -->|Send| Return
    
    style Request fill:#fff9c4
    style Flask fill:#fff3e0
    style Validation fill:#ffccbc
    style Model fill:#ffccbc
    style Response fill:#c8e6c9
    style Return fill:#fff9c4
```

### ML Model Pipeline

```python
# Input: 8 features
features = [
    age,           # 0-100
    pregnancies,   # 0-5+
    glucose,       # 0-200+
    bloodPressure, # 0-200
    skinThickness, # 0-100
    insulin,       # 0-300+
    bmi,           # 0-60+
    pedigree       # 0.0-2.0+
]

# Processing
normalized_features = scaler.transform(features)

# Prediction
prediction = model.predict(normalized_features)  # 0 or 1

# Confidence
probability = model.predict_proba(normalized_features)[0]
confidence = max(probability)

# Output
response = {
    "prediction": "Diabetic" if prediction[0] == 1 else "Non-Diabetic",
    "probability": round(probability[1], 2),
    "confidence": "High" if confidence > 0.8 else "Medium" if confidence > 0.6 else "Low"
}
```

---

## Component Interactions

### 1. **Theme Toggle Flow**

```mermaid
sequenceDiagram
    participant User
    participant Button as Theme Button
    participant JS as JavaScript
    participant Storage as LocalStorage
    participant CSS as CSS Variables
    participant DOM as DOM
    
    User->>Button: Click Toggle
    Button->>JS: Event Triggered
    JS->>JS: Toggle Theme (light↔dark)
    JS->>Storage: Save Theme
    Storage-->>JS: Saved
    JS->>CSS: Update Variables
    CSS->>DOM: Apply Styles
    JS->>JS: changeBackground()
    JS->>JS: setupBackgroundTimer()
    DOM-->>User: Display New Theme
```

### 2. **Age Input & Placeholder Update**

```mermaid
sequenceDiagram
    participant User
    participant Input as Age Input
    participant JS as JavaScript
    participant JSON as health_ranges.json
    participant DOM as Form Inputs
    
    User->>Input: Enter Age
    Input->>JS: Change Event
    JS->>JS: getHealthRangeForAge(age)
    JS->>JSON: Find Age Group
    JSON-->>JS: Return Ranges
    JS->>JS: updateHealthPlaceholders()
    JS->>DOM: Update Placeholder Text
    DOM-->>User: Display Ranges
```

### 3. **Form Submission & Prediction**

```mermaid
sequenceDiagram
    participant User
    participant Form
    participant JS as JavaScript
    participant Backend as Flask/Python
    participant Model as ML Model
    participant Response
    
    User->>Form: Fill & Submit
    Form->>JS: Submit Event
    JS->>JS: Collect Data
    JS->>JS: Validate Data
    JS->>Backend: POST /predict JSON
    Backend->>Backend: Validate Input
    Backend->>Model: Extract Features
    Model->>Model: Predict
    Model-->>Backend: Result
    Backend-->>Response: JSON Response
    Response->>JS: Parse Response
    JS->>Form: Display Result
    Form-->>User: Show Prediction
```

---

## State Management

### Frontend State Variables

```javascript
// Theme State
currentTheme: 'light' | 'dark'  // Persisted in localStorage

// Background State
backgroundChangeTimer: IntervalID  // Timer for automatic rotation
BACKGROUND_CHANGE_INTERVAL: 30000  // 30 seconds

// Health Data State
healthRanges: Array<AgeGroup>  // Loaded from JSON

// Form State
age: number
gender: 'male' | 'female' | ''
pregnancies: 0 | 1 | 2 | 3 | 4 | 5
glucose: number
bp: number
skin: number
insulin: number
bmi: number
pedigree: number
```

### Backend State

```python
# Model State
model: LogisticRegression  # Loaded once on startup
scaler: StandardScaler     # Feature scaling

# Request State
input_data: dict           # User submitted data
features: np.array         # Extracted features
prediction: int            # 0 or 1
probability: float         # Confidence score
```

---

## Error Handling

### Frontend Error Handling

```mermaid
graph TD
    A["Try Block"]
    A -->|Operation| B{"Error?"}
    B -->|No| C["Continue"]
    B -->|Yes| D["Catch Block"]
    
    D -->|Network Error| E["'Error connecting<br/>to server!'"]
    D -->|Invalid JSON| F["'Invalid response<br/>format'"]
    D -->|Timeout| G["'Request timeout<br/>Try again'"]
    
    E -->|Display| H["Result Container"]
    F -->|Display| H
    G -->|Display| H
    
    H -->|Show to User| I["Error Message"]
    
    style A fill:#fff9c4
    style C fill:#c8e6c9
    style E fill:#ffccbc
    style F fill:#ffccbc
    style G fill:#ffccbc
    style I fill:#ffccbc
```

### Backend Error Handling

```python
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Validation
        required_fields = ['age', 'pregnancies', 'glucose', ...]
        for field in required_fields:
            if field not in data:
                return {'error': 'Missing field', 'field': field}, 400
        
        # Type & Range Validation
        if not isinstance(data['age'], (int, float)):
            return {'error': 'Age must be a number'}, 400
        
        if data['age'] < 0 or data['age'] > 120:
            return {'error': 'Age must be between 0 and 120'}, 400
        
        # Processing
        features = extract_features(data)
        prediction = model.predict([features])[0]
        
        return {
            'prediction': 'Diabetic' if prediction == 1 else 'Non-Diabetic',
            'status': 'success'
        }, 200
    
    except Exception as e:
        return {'error': str(e)}, 500
```

---

## Data Validation Rules

| Field | Type | Min | Max | Required |
|-------|------|-----|-----|----------|
| age | number | 0 | 120 | ✓ |
| pregnancies | number | 0 | 5 | ✓ |
| glucose | number | 0 | 300 | ✓ |
| bp | number | 0 | 250 | ✓ |
| skin | number | 0 | 100 | ✓ |
| insulin | number | 0 | 500 | ✓ |
| bmi | number | 0 | 60 | ✓ |
| pedigree | number | 0.0 | 2.5 | ✓ |
| gender | string | - | - | ✓ |

---

**Last Updated**: December 8, 2025
**Version**: 1.0
