from fastapi import FastAPI, HTTPException
from pysnmp.hlapi import SnmpEngine, UsmUserData, usmHMACSHAAuthProtocol, usmDESPrivProtocol, setCmd, UdpTransportTarget, ContextData, ObjectType, ObjectIdentity
from pysnmp.hlapi import *
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder
from getdata import fetch_snmp_data
from setdata import snmp_set
from activif import get_active_interfaces
from ipadres import get_ip_addresses
from sentrecv import get_snmp_values

app = FastAPI()
# Enable CORS to allow requests from any source
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Define the SNMP data endpoint
@app.get("/snmp_data")
def snmp_data():
    data = fetch_snmp_data()
    if data:
        return data
    else:
        return {"error": "Failed to retrieve SNMP data"}
    






# Pydantic model for the incoming data in the PUT request
class SNMPDataUpdate(BaseModel):
    contact: str | None = None
    location: str | None = None

# Function to perform SNMP SET operation

# Define the PUT endpoint to update the contact and location fields
@app.put("/snmp_data")
def update_snmp_data(data: SNMPDataUpdate):
    

    if not data.contact and not data.location:
        raise HTTPException(status_code=400, detail="Either contact or location must be provided for update")

    success = False
    
    # If contact is provided, update the sysContact field
    if data.contact:
        success = snmp_set('1.3.6.1.2.1.1.4.0', data.contact)
    
    # If location is provided, update the sysLocation field
    if data.location:
        success = snmp_set('1.3.6.1.2.1.1.6.0', data.location)
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update SNMP data")
    
    return {"message": "SNMP data updated successfully"}
  



@app.get("/active-interfaces")
def read_active_interfaces():
    target_ip = 'localhost'  # Replace if needed
    community = 'public'     # Replace if needed
    return get_active_interfaces(target_ip, community)



@app.get("/ipaddress")
def get_ip_address():
   return get_ip_addresses()






@app.get("/snmp/{index}")
async def get_snmp_data(index: int):
    sent_oid = f'1.3.6.1.2.1.2.2.1.16.{index}'
    recv_oid = f'1.3.6.1.2.1.2.2.1.10.{index}'
    
    sent, recv = get_snmp_values(sent_oid, recv_oid)
    
    if sent is not None and recv is not None:
        return {"sent": sent, "received": recv}
    else:
        return {"error": "Failed to retrieve SNMP data"}