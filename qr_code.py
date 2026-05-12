import qrcode
import json

data = {
    "insteractior_id": "1242342",
    "course_code": "cs101",
    "uni": "SCU",
    "faculity": "CS"
}

json_data = json.dumps(data)

qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)

qr.add_data(json_data)

qr.make(fit=True)

img = qr.make_image(
    fill_color="black",
    back_color="white"
)

img.save("qrcode.png")

print("QR code saved")