// Helper method to wait.
export async function sleep(ms: number): Promise<void> {
    await new Promise<void>((resolve) => {
        setTimeout(() => { resolve() }, ms);
    });
}