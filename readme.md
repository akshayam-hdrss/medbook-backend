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

# Doctor API Documentation

## Base Route
`/api/doctor`

---

### ✅ Get All Doctors (Filtered)
**GET** `/api/doctor?doctorTypeId=&hospitalId=`

Returns:
- doctorId
- doctorName
- imageUrl
- businessName
- location
- phone
- whatsapp
- rating

---

### ✅ Get Doctor By ID
**GET** `/api/doctor/:id`

Returns full details of the doctor.

---

### ✅ Add New Doctor
**POST** `/api/doctor`

Body:
```json
{
  "doctorName": "Dr. Smith",
  "imageUrl": "https://...",
  "businessName": "ABC Clinic",
  "location": "Dubai",
  "phone": "+971-123456",
  "whatsapp": "+971-654321",
  "rating": 4.8,
  "experience": "10 years",
  "addressLine1": "Street 1",
  "addressLine2": "Near Hospital",
  "mapLink": "https://maps.google.com/...",
  "about": "About doctor...",
  "gallery": ["https://img1", "https://img2"],
  "youtubeLink": "https://youtube.com/...",
  "doctorTypeId": 1,
  "hospitalId": 1
}
```

---

### ✅ Update Doctor
**PUT** `/api/doctor/:id`

Body: Same as above.

---

### ✅ Delete Doctor
**DELETE** `/api/doctor/:id`

---

### ✅ Add Review
**POST** `/api/doctor/:id/review`

Body:
```json
{
  "comment": "Very professional",
  "rating": 5
}
```

---

### ✅ Get Reviews
**GET** `/api/doctor/:id/reviews`