from pysnmp.hlapi import *

def get_snmp_values(sent_oid, recv_oid):
    iterator = getCmd(
        SnmpEngine(),
        CommunityData('public', mpModel=0),  # SNMPv1 (change mpModel=1 for v2c if needed)
        UdpTransportTarget(('localhost', 161)),  # Change 'localhost' to your SNMP device IP if needed
        ContextData(),
        ObjectType(ObjectIdentity(sent_oid)),
        ObjectType(ObjectIdentity(recv_oid))
    )

    errorIndication, errorStatus, errorIndex, varBinds = next(iterator)

    if errorIndication or errorStatus:
        print(f"SNMP Error: {errorIndication or errorStatus}")
        return None, None

    sent_bytes = int(varBinds[0][1])
    recv_bytes = int(varBinds[1][1])

    return sent_bytes, recv_bytes
