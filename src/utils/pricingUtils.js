// Utility function to format variable pricing for display
export const formatVariablePricing = (event) => {
  if (!event.variable_pricing) {
    return event.price
  }

  try {
    const pricingTiers = JSON.parse(event.price)

    if (!Array.isArray(pricingTiers) || pricingTiers.length === 0) {
      return event.price
    }

    // Group consecutive participant counts with the same price
    const groupedPricing = []
    let currentGroup = {
      startCount: pricingTiers[0].participant_count,
      endCount: pricingTiers[0].participant_count,
      price: pricingTiers[0].price,
    }

    for (let i = 1; i < pricingTiers.length; i++) {
      const currentTier = pricingTiers[i]

      if (currentTier.price === currentGroup.price && currentTier.participant_count === currentGroup.endCount + 1) {
        // Same price and consecutive count, extend the group
        currentGroup.endCount = currentTier.participant_count
      } else {
        // Different price or non-consecutive, start new group
        groupedPricing.push(currentGroup)
        currentGroup = {
          startCount: currentTier.participant_count,
          endCount: currentTier.participant_count,
          price: currentTier.price,
        }
      }
    }

    // Add the last group
    groupedPricing.push(currentGroup)

    // Format the grouped pricing
    return groupedPricing
      .map((group) => {
        if (group.startCount === group.endCount) {
          return `${group.startCount}: ₹${group.price}`
        } else {
          return `${group.startCount}-${group.endCount}: ₹${group.price}`
        }
      })
      .join(" / ")
  } catch (error) {
    console.error("Error parsing variable pricing:", error)
    return event.price
  }
}

// Utility function to get price for specific participant count
export const getPriceForParticipants = (event, participantCount) => {
  if (!event.variable_pricing) {
    return event.price
  }

  try {
    const pricingTiers = JSON.parse(event.price)
    const tier = pricingTiers.find((t) => t.participant_count === participantCount)

    if (tier) {
      return tier.price
    }

    // If exact count not found, return the highest tier price
    return pricingTiers[pricingTiers.length - 1]?.price || event.price
  } catch (error) {
    console.error("Error getting price for participants:", error)
    return event.price
  }
}
