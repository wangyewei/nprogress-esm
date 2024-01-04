export type DightEnum<
  N extends number,
  Acc extends number[] = []
> = Acc['length'] extends N
  ? Acc[number]
  : DightEnum<N, [...Acc, Acc['length']]>
