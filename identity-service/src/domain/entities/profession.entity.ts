export type FieldType = "text" | "number" | "date" | "array" | "file" | "geo"

export interface FieldConstraint {
  minLength?: number
  maxLength?: number
  pattern?: string
  min?: number
  max?: number
  minItems?: number
  maxItems?: number
  itemType?: FieldType
  allowedTypes?: string[]
  maxSizeMB?: number
  minDate?: string
  maxDate?: string
  radiusLimitKM?: number
}

export interface FieldDefinition {
  key: string
  label: string
  type: FieldType
  required: boolean
  constraints?: FieldConstraint
}

export interface Profession {
  id: string
  name: string
  description?: string
  fields: FieldDefinition[],
	isActive: boolean
}
