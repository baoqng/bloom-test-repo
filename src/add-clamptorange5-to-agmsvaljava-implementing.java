package com.example.agms;

/**
 * AgmsVal provides utility methods for value operations including range clamping.
 */
public class AgmsVal {

    /**
     * Clamps a number to an inclusive [min, max] range.
     * 
     * If the value is less than min, returns min.
     * If the value is greater than max, returns max.
     * Otherwise, returns the value unchanged.
     * 
     * Both min and max boundaries are inclusive.
     * 
     * @param value the number to clamp
     * @param min the minimum value (inclusive)
     * @param max the maximum value (inclusive)
     * @return the clamped value within [min, max]
     * @throws IllegalArgumentException if min > max
     */
    public static double clampToRange_5(double value, double min, double max) {
        if (min > max) {
            throw new IllegalArgumentException("min must be less than or equal to max");
        }
        
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    }

    /**
     * Clamps an integer to an inclusive [min, max] range.
     * 
     * If the value is less than min, returns min.
     * If the value is greater than max, returns max.
     * Otherwise, returns the value unchanged.
     * 
     * Both min and max boundaries are inclusive.
     * 
     * @param value the number to clamp
     * @param min the minimum value (inclusive)
     * @param max the maximum value (inclusive)
     * @return the clamped value within [min, max]
     * @throws IllegalArgumentException if min > max
     */
    public static int clampToRange_5(int value, int min, int max) {
        if (min > max) {
            throw new IllegalArgumentException("min must be less than or equal to max");
        }
        
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    }

    /**
     * Clamps a long to an inclusive [min, max] range.
     * 
     * If the value is less than min, returns min.
     * If the value is greater than max, returns max.
     * Otherwise, returns the value unchanged.
     * 
     * Both min and max boundaries are inclusive.
     * 
     * @param value the number to clamp
     * @param min the minimum value (inclusive)
     * @param max the maximum value (inclusive)
     * @return the clamped value within [min, max]
     * @throws IllegalArgumentException if min > max
     */
    public static long clampToRange_5(long value, long min, long max) {
        if (min > max) {
            throw new IllegalArgumentException("min must be less than or equal to max");
        }
        
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    }
}