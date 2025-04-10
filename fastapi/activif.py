from pysnmp.hlapi import *
import time

def snmp_walk(target, community, base_oid, port=161):
    result = {}
    for (errorIndication,
         errorStatus,
         errorIndex,
         varBinds) in nextCmd(SnmpEngine(),
                              CommunityData(community, mpModel=0),
                              UdpTransportTarget((target, port)),
                              ContextData(),
                              ObjectType(ObjectIdentity(base_oid)),
                              lexicographicMode=False):
        if errorIndication:
            print(f"Error: {errorIndication}")
            break
        elif errorStatus:
            print(f"Error: {errorStatus.prettyPrint()}")
            break
        else:
            for varBind in varBinds:
                oid, value = varBind
                index = int(oid.prettyPrint().split('.')[-1])
                result[index] = value
    return result

def get_active_interfaces(target, community):
    # Base OIDs
    oids = {
        'type': '1.3.6.1.2.1.2.2.1.3',
        'status': '1.3.6.1.2.1.2.2.1.8',
        'speed': '1.3.6.1.2.1.2.2.1.5',
        'mtu': '1.3.6.1.2.1.2.2.1.4',
        'in': '1.3.6.1.2.1.2.2.1.10',
        'out': '1.3.6.1.2.1.2.2.1.16',
        'desc': '1.3.6.1.2.1.2.2.1.2',
    }

    iftype_mapping = {
        '1': 'Other',
        '6': 'Ethernet',
        '24': 'Loopback(Localhost)',
        '53': 'PPP',
        '71': 'Wi-Fi (IEEE 802.11)',
        '131': 'Tunnel',
    }

    ifstatus_mapping = {
        '1': 'up',
        '2': 'down',
        '3': 'testing',
        '4': 'unknown',
        '5': 'dormant',
        '6': 'notPresent',
        '7': 'lowerLayerDown',
    }

    # Initial in/out
    in_octets_1 = snmp_walk(target, community, oids['in'])
    out_octets_1 = snmp_walk(target, community, oids['out'])
    time.sleep(1)
    in_octets_2 = snmp_walk(target, community, oids['in'])
    out_octets_2 = snmp_walk(target, community, oids['out'])

    # Other info
    types = snmp_walk(target, community, oids['type'])
    status = snmp_walk(target, community, oids['status'])
    speed = snmp_walk(target, community, oids['speed'])
    mtu = snmp_walk(target, community, oids['mtu'])
    desc = snmp_walk(target, community, oids['desc'])

    active_interfaces = {}

    for index in set(in_octets_1) | set(out_octets_1):
        recvd = int(in_octets_1.get(index, 0))
        sent = int(out_octets_1.get(index, 0))
     

        if recvd > 0 or sent > 0:
            type_val = str(types.get(index, 'N/A'))
            status_val = str(status.get(index, 'N/A'))
            type_str = f"{type_val} ({iftype_mapping.get(type_val, 'Unknown')})"
            status_str = f"{status_val} ({ifstatus_mapping.get(status_val, 'Unknown')})"

            active_interfaces[index] = {
                'Description': str(desc.get(index, 'N/A')),
                'Type': type_str,
                'Status': status_str,
                'Speed': str(speed.get(index, 'N/A')),
                'MTU': str(mtu.get(index, 'N/A')),
                'Received': recvd,
                'Transmitted': sent,
                
            }

    return active_interfaces
