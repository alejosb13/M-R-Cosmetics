import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "firstAndLastArray",
})
export class FirstAndLastArrayPipe implements PipeTransform {
  transform(
    value: number[]
  ): { first: number; last: number; count: number } | null {
    if (!Array.isArray(value) || value.length === 0) {
      return null;
    }

    const first = value.find((item) => item !== undefined && item !== null);
    const last = [...value]
      .reverse()
      .find((item) => item !== undefined && item !== null);
    const count = value.length;

    return { first, last, count };
  }
}
