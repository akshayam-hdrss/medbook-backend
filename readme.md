# 🏥 MedBook API Documentation



## ☁️ Upload API

### POST /upload
- Upload image to Cloudinary.
- Form data: `image` (file)

```json
{
  "message": "Uploaded",
  "imageUrl": "https://res.cloudinary.com/.../your-image.jpg"
}
```


## 🔹 Hospital Type APIs

### GET /api/hospitalType
- Fetch all hospital types.
```json
{
  "result": "Success",
  "resultData": [
    { "id": 1, "name": "General", "imageUrl": "" }
  ]
}
```

### POST /api/hospitalType
- Add a new hospital type.
```json
{
  "name": "Dental",
  "imageUrl": "https://example.com/image.jpg"
}
```

### PUT /api/hospitalType/:id
- Update a hospital type.
```json
{
  "name": "Updated Name",
  "imageUrl": "https://example.com/new-image.jpg"
}
```

### DELETE /api/hospitalType/:id
- Delete a hospital type.

---

## 🔹 Hospital APIs

### GET /api/hospital
- Fetch all hospitals.
```json
{
  "result": "Success",
  "resultData": [
    {
      "id": 1,
      "name": "Apollo",
      "imageUrl": "",
      "area": "",
      "mapLink": "",
      "phone": "",
      "hospitalTypeId": 1
    }
  ]
}
```

### POST /api/hospital
- Add a new hospital.
```json
{
  "name": "Apollo Hospital",
  "imageUrl": "https://example.com/image.jpg",
  "area": "Dubai",
  "mapLink": "https://maps.google.com/example",
  "phone": "+971-123456789",
  "hospitalTypeId": 1
}
```

### PUT /api/hospital/:id
- Update a hospital.
```json
{
  "name": "Updated Hospital",
  "imageUrl": "",
  "area": "",
  "mapLink": "",
  "phone": "",
  "hospitalTypeId": 1
}
```

### DELETE /api/hospital/:id
- Delete a hospital.

---

