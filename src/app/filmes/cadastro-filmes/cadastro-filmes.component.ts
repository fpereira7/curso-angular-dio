import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ValidarCamposService } from 'src/app/shared/components/campos/validar-campos.service';
import { Filme } from 'src/app/shared/models/filme';
import { FilmesService } from 'src/app/core/filmes.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { Alerta } from 'src/app/shared/models/alerta';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dio-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss']
})
export class CadastroFilmesComponent implements OnInit {

  id: number;
  cadastro: FormGroup;
  generos: Array<string>;

  constructor(public validacao: ValidarCamposService,
              public dialog: MatDialog,
              private fb: FormBuilder,
              private filmesService: FilmesService,
              private router: Router,
              private activatedRoute: ActivatedRoute
              ) { }

  get f() {
    return this.cadastro.controls;
  }

  ngOnInit(): void {

    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id) {
      this.filmesService.visualizar(this.id)
        .subscribe((filme: Filme) => this.criarfomulario(filme));
    } else {
      this.criarfomulario(this.criarFilmeEmBranco());
    }

    this.generos = ['Açao', 'Aventura', 'Ficção Científica', 'Romance', 'Terror', 'Comédia'];
  }

  submit(): void {
    this.cadastro.markAllAsTouched();
    if (this.cadastro.invalid) {
      return;
    }

    const filme = this.cadastro.getRawValue() as Filme;

    if (this.id) {
      filme.id = this.id;
      this.editar(filme);
    } else {
      this.salvar(filme);
    }
    
  }

  reiniciarForm(): void {
    this.cadastro.reset();
  }

  private criarfomulario(filme: Filme): void {
    this.cadastro = this.fb.group({
      titulo: [filme.titulo, [Validators.required, Validators.minLength(2), Validators.maxLength(256)]],
      urlFoto: [filme.urlFoto, [Validators.minLength(10)]],
      dataLancamento: [filme.dataLancamento, [Validators.required]],
      descricao: [filme.descricao],
      notaIMDB: [filme.notaIMDB, [Validators.required, Validators.min(0), Validators.max(10)]],
      urlIMDB: [filme.urlIMDB, [Validators.minLength(10)]],
      genero: [filme.genero, [Validators.required]]
    });
  }

  private criarFilmeEmBranco(): Filme {
    return {
      id: null,
      titulo: null,
      dataLancamento: null,
      urlFoto: null,
      descricao: null,
      notaIMDB: null,
      urlIMDB: null,
      genero: null
    } as Filme;
  }

  private salvar(filme: Filme): void {
    this.filmesService.salvar(filme).subscribe(() =>{
      const config = {
        data: {
          btnSucesso: 'Ir para a listagem',
          btnCancelar: 'Cadastrar um novo filme',
          corBtnCancelar: 'primary',
          possuiBtnFechar: true
        } as Alerta
      };
     const dialogRef = this.dialog.open(AlertaComponent, config);
     dialogRef.afterClosed().subscribe((opcao: boolean) => {
       if (opcao) {
         this.router.navigateByUrl('filmes');
       } else {
         this.reiniciarForm();
       }
     });
    },
    () =>  {
      const config = {
        data: {
          titulo: 'Erro ao salvar o registro',
          descricao: 'Não conseguimos salvar seu registro, favor tentar novamente mais tarde.',
          corBtnSucesso: 'warn',
          btnSucesso: 'Fechar'
        } as Alerta
      };
      this.dialog.open(AlertaComponent, config);

    });
}

private editar(filme: Filme): void {
  this.filmesService.editar(filme).subscribe(() =>{
    const config = {
      data: {
        descricao: 'Seu registro foi atualizado com sucesso!',
        btnSucesso: 'Ir para a listagem'
      } as Alerta
    };
   const dialogRef = this.dialog.open(AlertaComponent, config);
   dialogRef.afterClosed().subscribe(() => this.router.navigateByUrl('filmes'));
  },
  () =>  {
    const config = {
      data: {
        titulo: 'Erro ao editar o registro',
        descricao: 'Não conseguimos editar seu registro, favor tentar novamente mais tarde.',
        corBtnSucesso: 'warn',
        btnSucesso: 'Fechar'
      } as Alerta
    };
    this.dialog.open(AlertaComponent, config);

  });
}

}
