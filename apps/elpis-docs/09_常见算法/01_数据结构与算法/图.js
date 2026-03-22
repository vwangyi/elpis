for (let i = 1; i <= 9; i++) {
    for (let j = 1; j <= i; j++) {
        const result = `${j}×${i}=${i * j} `
        if(j === 2 && (i === 3 || i === 4)) { 
            process.stdout.write(`${result} `);
            continue;
        }
        process.stdout.write(result);
    }
    console.log();
}
