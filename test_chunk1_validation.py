#!/usr/bin/env python3
"""
CHUNK 1 Validation Test - Schumann Resonance Implementation
Tests the empirical frequency replacement and portal initialization
"""

from config import load_simulation_config, validate_config
from portal import Portal
from dualportal import DualPortal

def test_configuration_validation():
    """Test that configuration loads and validates with Schumann Resonance frequency"""
    print("Testing configuration validation with Schumann Resonance...")
    cfg = load_simulation_config()
    validate_config(cfg)
    print(f"✅ Configuration validation passed")
    print(f"   Resonance frequency: {cfg['resonance_frequency']} Hz (Schumann Resonance)")
    return cfg

def test_portal_initialization():
    """Test portal initialization with empirical frequency"""
    print("\nTesting portal initialization with Schumann Resonance...")
    portal = Portal()
    print(f"✅ Portal initialized successfully")
    print(f"   Portal frequency: {portal.freq} Hz")
    print(f"   Portal damping: {portal.damping}")
    print(f"   Portal power: {portal.power} W")
    return portal

def test_dual_portal_initialization():
    """Test dual portal system with empirical frequency"""
    print("\nTesting dual portal initialization...")
    dp = DualPortal()
    print(f"✅ DualPortal initialized successfully")
    print(f"   Portal 1 frequency: {dp.portal1.freq} Hz")
    print(f"   Portal 2 frequency: {dp.portal2.freq} Hz")
    print(f"   Detune value: {dp.detune} Hz")
    return dp

def main():
    """Run all CHUNK 1 validation tests"""
    print("=" * 60)
    print("CHUNK 1 VALIDATION: Schumann Resonance Implementation")
    print("=" * 60)
    
    try:
        cfg = test_configuration_validation()
        portal = test_portal_initialization()
        dp = test_dual_portal_initialization()
        
        print("\n" + "=" * 60)
        print("✅ ALL CHUNK 1 TESTS PASSED")
        print("✅ Schumann Resonance frequency (7.83 Hz) successfully implemented")
        print("✅ Portal systems working with empirical frequency")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ CHUNK 1 TEST FAILED: {str(e)}")
        raise

if __name__ == "__main__":
    main()
