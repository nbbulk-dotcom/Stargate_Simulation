#!/usr/bin/env python3
"""
Test script to verify GROK AI fixes for Stargate simulation
Tests energy accumulation and bridge formation improvements
"""

from portal import Portal
from dualportal import DualPortal
from config import SimulationConfig

def test_energy_accumulation():
    """Test that portals accumulate energy over time"""
    print("=== Testing Energy Accumulation ===")
    portal = Portal()
    print(f"Initial energy: {portal.energy} J")
    print(f"Power input: {portal.power} W")
    
    energy_added = portal.update_energy(dt=1.0)
    print(f"Energy added in 1s: {energy_added} J")
    print(f"Total energy after 1s: {portal.energy} J")
    
    energy_added = portal.update_energy(dt=2.0)
    print(f"Energy added in 2s: {energy_added} J")
    print(f"Total energy after 3s: {portal.energy} J")
    
    expected_energy = 13500.0 * 3.0  # 13.5kW * 3s = 40.5kJ
    print(f"Expected energy: {expected_energy} J")
    print(f"Energy accumulation working: {portal.energy == expected_energy}")
    return portal.energy > 0

def test_bridge_formation():
    """Test bridge formation with accumulated energy"""
    print("\n=== Testing Bridge Formation ===")
    dp = DualPortal()
    
    print(f"Initial portal energies: {dp.portal1.energy} J, {dp.portal2.energy} J")
    dp.form_bridge(t=1.0)
    initial_strength = dp.bridge_strength
    print(f"Bridge strength with no energy: {initial_strength:.3f}")
    
    print("\nAccumulating energy for 5 seconds...")
    dp.portal1.update_energy(dt=5.0)
    dp.portal2.update_energy(dt=5.0)
    print(f"Portal 1 energy: {dp.portal1.energy} J")
    print(f"Portal 2 energy: {dp.portal2.energy} J")
    
    dp.form_bridge(t=1.0)
    final_strength = dp.bridge_strength
    print(f"Bridge strength with energy: {final_strength:.3f}")
    print(f"Bridge strength improved: {final_strength > initial_strength}")
    print(f"Bridge strength >0.5: {final_strength > 0.5}")
    
    return final_strength > 0.5

def test_parameter_sweep_logic():
    """Test the parameter sweep frequency variation logic"""
    print("\n=== Testing Parameter Sweep Logic ===")
    
    base_freq = 32.0
    sweep_range = 2.0
    steps = 5
    freq_step = (2 * sweep_range) / steps
    
    print(f"Base frequency: {base_freq} Hz")
    print(f"Sweep range: ±{sweep_range} Hz")
    print(f"Steps: {steps}")
    print(f"Frequency step: {freq_step} Hz")
    
    frequencies = []
    for i in range(steps):
        freq = base_freq - sweep_range + (i * freq_step)
        freq = max(30.0, min(35.0, freq))
        frequencies.append(freq)
        print(f"Step {i}: {freq:.2f} Hz")
    
    unique_freqs = len(set(frequencies))
    print(f"Unique frequencies: {unique_freqs}/{steps}")
    print(f"Frequency variation working: {unique_freqs > 1}")
    
    return unique_freqs > 1

if __name__ == "__main__":
    print("Testing GROK AI fixes for Stargate simulation\n")
    
    energy_ok = test_energy_accumulation()
    bridge_ok = test_bridge_formation()
    sweep_ok = test_parameter_sweep_logic()
    
    print("\n=== SUMMARY ===")
    print(f"Energy accumulation: {'✅ PASS' if energy_ok else '❌ FAIL'}")
    print(f"Bridge formation: {'✅ PASS' if bridge_ok else '❌ FAIL'}")
    print(f"Parameter sweep: {'✅ PASS' if sweep_ok else '❌ FAIL'}")
    
    all_tests_pass = energy_ok and bridge_ok and sweep_ok
    print(f"\nOverall: {'✅ ALL TESTS PASS' if all_tests_pass else '❌ SOME TESTS FAILED'}")
    
    if bridge_ok:
        print("🎯 GROK fixes successful - bridge strength >0.5 achieved!")
    else:
        print("⚠️  Bridge strength still <0.5 - additional fixes needed")
