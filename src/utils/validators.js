export const validateRequired = (value) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return 'Field ini wajib diisi'
  }
  return null
}

export const validateUniqueName = (name, existingItems, currentId = null) => {
  const normalizedName = name.trim().toLowerCase()
  const duplicate = existingItems.find(item =>
    item.name.trim().toLowerCase() === normalizedName &&
    item.id !== currentId
  )

  if (duplicate) {
    return 'Nama sudah digunakan, silakan gunakan nama lain'
  }
  return null
}

export const validatePercentage = (value, fieldName = 'Persentase') => {
  const num = parseFloat(value)

  if (isNaN(num)) {
    return `${fieldName} harus berupa angka`
  }

  if (num < 0 || num >= 100) {
    return `${fieldName} harus antara 0 dan 100`
  }

  return null
}

export const validatePositiveNumber = (value, fieldName = 'Nilai') => {
  const num = parseFloat(value)

  if (isNaN(num)) {
    return `${fieldName} harus berupa angka`
  }

  if (num < 0) {
    return `${fieldName} tidak boleh negatif`
  }

  return null
}

export const validatePrice = (value) => {
  const num = parseFloat(value)

  if (isNaN(num)) {
    return 'Harga harus berupa angka'
  }

  if (num < 0) {
    return 'Harga tidak boleh negatif'
  }

  return null
}

export const validateQuantity = (value) => {
  const num = parseFloat(value)

  if (isNaN(num)) {
    return 'Kuantitas harus berupa angka'
  }

  if (num <= 0) {
    return 'Kuantitas harus lebih dari 0'
  }

  return null
}

export const validateBomItems = (bomItems) => {
  if (!bomItems || bomItems.length === 0) {
    return 'Produk harus memiliki minimal 1 material'
  }

  for (const item of bomItems) {
    if (!item.material_id) {
      return 'Pilih material untuk semua item'
    }

    const quantityError = validateQuantity(item.quantity)
    if (quantityError) {
      return `Kuantitas tidak valid: ${quantityError}`
    }

    const priceError = validatePrice(item.price)
    if (priceError) {
      return `Harga tidak valid: ${priceError}`
    }
  }

  return null
}

export const validateCategoryForm = (formData, existingCategories, currentId = null) => {
  const errors = {}

  const requiredError = validateRequired(formData.name)
  if (requiredError) {
    errors.name = requiredError
  } else {
    const uniqueError = validateUniqueName(formData.name, existingCategories, currentId)
    if (uniqueError) {
      errors.name = uniqueError
    }
  }

  return errors
}

export const validateMaterialForm = (formData, existingMaterials, currentId = null) => {
  const errors = {}

  const nameError = validateRequired(formData.name)
  if (nameError) {
    errors.name = nameError
  } else {
    const uniqueError = validateUniqueName(formData.name, existingMaterials, currentId)
    if (uniqueError) {
      errors.name = uniqueError
    }
  }

  if (!formData.category_id) {
    errors.category_id = 'Pilih kategori'
  }

  const priceError = validatePrice(formData.standard_price)
  if (priceError) {
    errors.standard_price = priceError
  }

  if (!formData.unit) {
    errors.unit = 'Pilih satuan'
  }

  return errors
}

export const validateProductForm = (formData, bomItems, existingProducts, currentId = null, originalName = null) => {
  const errors = {}

  const nameError = validateRequired(formData.name)
  if (nameError) {
    errors.name = nameError
  } else {
    if (originalName && formData.name.trim().toLowerCase() === originalName.trim().toLowerCase()) {
      errors.name = 'Nama produk harus berbeda dari produk asli saat menyalin'
    } else {
      const uniqueError = validateUniqueName(formData.name, existingProducts, currentId)
      if (uniqueError) {
        errors.name = uniqueError
      }
    }
  }


  const overheadError = validatePercentage(formData.overhead_percentage, 'Overhead')
  if (overheadError) {
    errors.overhead_percentage = overheadError
  }

  const marginError = validatePercentage(formData.target_margin_percentage, 'Margin pabrik')
  if (marginError) {
    errors.target_margin_percentage = marginError
  }

  const marginJualError = validatePercentage(formData.margin_jual_percentage, 'Margin jual')
  if (marginJualError) {
    errors.margin_jual_percentage = marginJualError
  }

  const adminError = validatePercentage(formData.admin_marketplace_percentage, 'Admin marketplace')
  if (adminError) {
    errors.admin_marketplace_percentage = adminError
  }

  const bomError = validateBomItems(bomItems)
  if (bomError) {
    errors.bom = bomError
  }

  return errors
}

export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0
}
