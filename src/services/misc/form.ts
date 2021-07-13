export type FormValidationHandler<T> = () => Promise<Error | null>

export type FormValidationBuilder<T> = (input: T) => FormValidationHandler<T>
