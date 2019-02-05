class Display {
  static stdoutLn(content) {
    process.stdout.write(`${content}\n`);
  }

  static showResult(result) {
    const people = result[0] * 1000;
    const area = result[1] / 100;
    const densityPm = Math.round((people / area) * 100) / 100;
    const deptCode = result[2];
    this.stdoutLn(`Dept N°${deptCode} has ${people} people spread over ${area}Km2, density is ${densityPm}.`);
  }
}
module.exports = Display;
