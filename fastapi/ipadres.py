from pysnmp.hlapi import *
from pysnmp.proto.rfc1902 import IpAddress

def process_value(value):
    """
    Processes the SNMP value depending on its type.
    If it's an IpAddress (netmask), it converts it into a human-readable format.
    """
    if isinstance(value, IpAddress):
        value = str(value)  # Convert IpAddress to string for easy comparison

        # Check for known IP address formats and return their corresponding netmask
        if value == 'ÿ\x00\x00\x00':  # 255.0.0.0
            return "255.0.0.0"
        elif value == 'ÿÿ\x00\x00':  # 255.255.0.0
            return "255.255.0.0"
        elif value == 'ÿÿÿ\x00':  # 255.255.255.0
            return "255.255.255.0"
        else:
            return "255.255.255.255"  # Default
    
    # If it's not an IpAddress, return the value directly
    return value


def get_snmp_data(oid):
    """
    Retrieve SNMP data for a given OID and process the value.
    """
    iterator = getCmd(SnmpEngine(),
                      CommunityData('public', mpModel=0),
                      UdpTransportTarget(('localhost', 161)),
                      ContextData(),
                      ObjectType(ObjectIdentity(oid)))
    
    errorIndication, errorStatus, errorIndex, varBinds = next(iterator)
    
    if errorIndication:
        print(f"Error retrieving SNMP data: {errorIndication}")
        return None
    elif errorStatus:
        print(f"Error in SNMP response: {errorStatus.prettyPrint()}")
        return None
    else:
        # Extract and process the value from the SNMP response
        for varBind in varBinds:
            value = varBind[1]  # Extract the value directly
            if oid.startswith('1.3.6.1.2.1.4.20.1.3'):  # Check if it's a netmask
                return process_value(value)
            return value  # If it's not a netmask, just return the value


def get_ip_addresses():
    """
    Retrieve SNMP data for each IP and return it in a dictionary of dictionaries.
    """
    ip_addresses = [
        '127.0.0.1',
        '169.254.220.199',
        '169.254.225.98',
        '192.168.100.6',
        '192.168.154.125',
        '192.168.199.1',
        '192.168.253.1'
    ]
    
    result = {}
    
    for ip in ip_addresses:
        # Initialize a dictionary for each IP
        
        
        # Get SNMP data for each of the required OIDs
        ifIndex = get_snmp_data(f'1.3.6.1.2.1.4.20.1.2.{ip}')
        netMask = get_snmp_data(f'1.3.6.1.2.1.4.20.1.3.{ip}')
        bcastAddr = get_snmp_data(f'1.3.6.1.2.1.4.20.1.4.{ip}')
        reasmMaxSize = get_snmp_data(f'1.3.6.1.2.1.4.20.1.5.{ip}')


        addedStringForJustification =""
        if str(ip) =="192.168.100.6":
            addedStringForJustification=" (my Pc when connected to Home router)"
        elif str(ip) =="192.168.154.125": 
            addedStringForJustification =" (when connected to my Phone  hotspot)"

        result[ip_addresses.index(ip)] = {
            'ipAddress': str(ip)+addedStringForJustification,
            'ifIndex': str(ifIndex) if ifIndex else None,
            'netMask': str(netMask) if netMask else None,   
            'bcastAddr': str(bcastAddr) if bcastAddr else None,
            'reasmMaxSize': str(reasmMaxSize) if reasmMaxSize else None,
        }
        
       
    
    return result
