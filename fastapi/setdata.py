
from pysnmp.hlapi import setCmd, SnmpEngine, CommunityData, UdpTransportTarget, ContextData, ObjectType, ObjectIdentity



def snmp_set(oid, value):
    print("OID:", oid)
    print("Value:", value)

    g = setCmd(
        SnmpEngine(),
        CommunityData('public', mpModel=1),
        UdpTransportTarget(('localhost', 161)),
        ContextData(),
        ObjectType(
            ObjectIdentity(oid),
            value
        )
    )

    errorIndication, errorStatus, errorIndex, varBinds = next(g)

    if errorIndication:
        print(f"Error Indication: {errorIndication}")
        return False
    elif errorStatus:
        print(f"Error Status: {errorStatus.prettyPrint()} at index {errorIndex}")
        return False
    else:
        for varBind in varBinds:
            print(f"Successfully set: {varBind}")
        return True