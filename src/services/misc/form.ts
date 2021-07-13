export type FormValidationHandler<T> = () => Error | null

export type FormValidationBuilder<T> = (input: T) => FormValidationHandler<T>
