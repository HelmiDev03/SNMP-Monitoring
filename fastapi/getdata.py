
from pysnmp.hlapi import SnmpEngine, UsmUserData, usmHMACSHAAuthProtocol, usmDESPrivProtocol, setCmd, UdpTransportTarget, ContextData, ObjectType, ObjectIdentity
from pysnmp.hlapi import *

def decode_sys_services(value):
    layers = {
        1: "Physical",
        2: "Data Link",
        4: "Network",
        8: "Transport",
        16: "Session",
        32: "Presentation",
        64: "Application"
    }
    
    numeric_value = int(value)
    supported_layers = []

    for bit, name in layers.items():
        if numeric_value & bit:
            supported_layers.append(name)
    
    return supported_layers


def fetch_snmp_data():
    data = [
        ObjectType(ObjectIdentity('SNMPv2-MIB', 'sysDescr', 0)),
        ObjectType(ObjectIdentity('SNMPv2-MIB', 'sysUpTime', 0)),
        ObjectType(ObjectIdentity('SNMPv2-MIB', 'sysContact', 0)),
        ObjectType(ObjectIdentity('SNMPv2-MIB', 'sysName', 0)),
        ObjectType(ObjectIdentity('SNMPv2-MIB', 'sysLocation', 0)),
        ObjectType(ObjectIdentity('SNMPv2-MIB', 'sysServices', 0)),
    ]
    
    g = getCmd(
        SnmpEngine(),
        CommunityData('public', mpModel=0),
        UdpTransportTarget(('localhost', 161)),
        ContextData(),
        *data
    )
    
    errorIndication, errorStatus, errorIndex, varBinds = next(g)

    # Log detailed error information
    if errorIndication:
        print(f"Error Indication: {errorIndication}")
        return None
    elif errorStatus:
        print(f"Error Status: {errorStatus.prettyPrint()}")
        print(f"Error Index: {errorIndex}")
        if varBinds:
            print(f"VarBinds: {varBinds}")
        return None
    else:
        snmp_data = {}
        for varBind in varBinds:
            oid, value = varBind
            print(f"OID: {oid}, Value: {value}")  # Debugging line
            # Use OID to determine the correct label
            if str(oid) == "1.3.6.1.2.1.1.1.0":  # sysDescr OID
                snmp_data['description'] = str(value)
            elif str(oid) == "1.3.6.1.2.1.1.3.0":  # sysUpTime OID
                snmp_data['uptime'] = str(value)
            elif str(oid) == "1.3.6.1.2.1.1.4.0":  # sysContact OID
                snmp_data['contact'] = str(value)
            elif str(oid) == "1.3.6.1.2.1.1.5.0":  # sysName OID
                snmp_data['name'] = str(value)
            elif str(oid) == "1.3.6.1.2.1.1.6.0":  # sysLocation OID
                snmp_data['location'] = str(value)
            elif str(oid) == "1.3.6.1.2.1.1.7.0":  # sysServices OID
                snmp_data['services'] = str(value)
                v="( "
                for layer in decode_sys_services(value):
                    v+=layer+" , "
                v+=")"
                snmp_data['services'] += v    
                

            
        
        print(f"SNMP Data: {snmp_data}")  # Debugging line
        return snmp_data