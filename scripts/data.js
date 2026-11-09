export async function getServices() {
  try {
    const response = await fetch("data/services.json");

    if (!response.ok) {
      throw new Error(`Services request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Could not load service data.", error);
    throw error;
  }
}

export function getServiceCategories(services) {
  return ["Todos", ...new Set(services.map((service) => service.category))];
}
