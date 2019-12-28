import api from "./api";

class App {
  constructor() {
    this.repositories = [];

    this.ownerInput = document.getElementById("owner-input");
    this.repositoryInput = document.getElementById("repo-input");
    this.search = document.getElementById("search-btn");

    this.listElement = document.getElementById("repo-list");

    this.registerHandlers();
  }

  registerHandlers() {
    this.search.onclick = event => this.addRepository(event);
  }

  setLoading(isLoading = true) {
    if(isLoading === true) {
      let loading = document.createElement("div")
      loading.setAttribute("id", "loading-text")
      loading.appendChild(document.createTextNode("Carregando..."))
      document.getElementById("repo-list").appendChild(loading)
    } else {
      document.getElementById("loading-text").remove()
    }
  }

  async addRepository(event) {
    event.preventDefault();

    const userOwnerInput = this.ownerInput.value.trim();
    const repoInput = this.repositoryInput.value.trim();

    if (repoInput.length === 0 || userOwnerInput.length === 0) {
      return;
    }

    this.setLoading()

    try{
      const response = await api.get(`/repos/${userOwnerInput}/${repoInput}`);

      console.log("Resposta OK: ", response)

      const {
        name,
        description,
        html_url,
        owner: { avatar_url }
      } = response.data;

      const finaldescription = () => description === null ? "Sem descrição" : description

      this.repositories.push({
        name,
        description: finaldescription(),
        html_url,
        avatar_url
      });

      console.log(this.repositories);

      this.render();

      this.repositoryInput.value = ""

    } catch (err) {

      alert("Repositório não encontrado")
    }
    this.setLoading(false)
  }

  render() {
    this.listElement.innerHTML = "";

    this.repositories.map(repo => {
      let imgRepo = document.createElement("img");
      imgRepo.setAttribute("src", repo.avatar_url);

      let nameRepo = document.createElement("strong");
      nameRepo.appendChild(document.createTextNode(repo.name));

      let descriptionRepo = document.createElement("p");
      descriptionRepo.appendChild(document.createTextNode(repo.description));

      let linkRepo = document.createElement("a");
      linkRepo.setAttribute("href", repo.html_url);
      linkRepo.appendChild(document.createTextNode("Link"));

      let repoInfo = document.createElement("li");
      repoInfo.appendChild(imgRepo);
      repoInfo.appendChild(nameRepo);
      repoInfo.appendChild(descriptionRepo);
      repoInfo.appendChild(linkRepo);

      document.getElementById("repo-list").appendChild(repoInfo);
    });
  }
}

new App();
