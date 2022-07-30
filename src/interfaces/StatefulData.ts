import React from "react";

type GenericType<T> = T;
export interface StatefulData<T> extends GenericType<[T, React.Dispatch<React.SetStateAction<T>>]> { }