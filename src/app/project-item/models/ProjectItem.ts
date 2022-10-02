export class ProjectItem {
    name: string;
    shortDescription: string;
    fullDescription: string;
    url: URL;

    constructor(name: string, shortDescription: string, fullDescription: string, url: string) {
        this.name = name;
        this.shortDescription = shortDescription;
        this.fullDescription = fullDescription;
        this.url = ProjectItem.getValidUrlOrThrow(url);
    }

    static getValidUrlOrThrow(maybeUrl: string): URL {
        return new URL(maybeUrl);
    }
}

export let DEFAULT_PROJECT_ITEM: ProjectItem = new ProjectItem(
    'No Project Name Provided!',
    'Short description',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor sagittis nunc in tempus. Cras dapibus dui ac mattis congue. Curabitur pellentesque eros vel nisl auctor, eget cursus mauris finibus. Fusce placerat finibus augue, a imperdiet ipsum pharetra quis. Fusce mattis quam sit amet odio sagittis volutpat. Praesent pharetra dapibus turpis suscipit efficitur. Proin sagittis, turpis in facilisis mollis, nunc est euismod magna, a volutpat mi enim accumsan erat. Sed lobortis leo ut ligula ornare hendrerit. Curabitur condimentum ligula sed lobortis laoreet. In metus nunc, volutpat vel malesuada vitae, interdum in ligula.!',
    'https://www.example.com'
);

export let ALL_PROJECTS = [
    new ProjectItem(
        "EvalPrint Calculator",
        "Just a simple calculator",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor sagittis nunc in tempus. Cras dapibus dui ac mattis congue. Curabitur pellentesque eros vel nisl auctor, eget cursus mauris finibus. Fusce placerat finibus augue, a imperdiet ipsum pharetra quis. Fusce mattis quam sit amet odio sagittis volutpat. Praesent pharetra dapibus turpis suscipit efficitur. Proin sagittis, turpis in facilisis mollis, nunc est euismod magna, a volutpat mi enim accumsan erat. Sed lobortis leo ut ligula ornare hendrerit. Curabitur condimentum ligula sed lobortis laoreet. In metus nunc, volutpat vel malesuada vitae, interdum in ligula.",
        "https://github.com/erastus-murungi/calculator"
    )
]