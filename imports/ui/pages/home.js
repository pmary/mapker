import React from 'react';
import Alert from 'react-s-alert';
import Slideshow from '../components/slideshow/slideshow.js';

let _slides = [
  {
    backgroundImage: "url(http://dev.mapker.co/images/home/bg-header-1.jpg)",
    backgroundColor: "",
    caption: `<h1>WELCOME TO THE MAKER WORLD</h1>
    <h2>Find place, skills, communities and machines for you projects</h2>
    <a class="btn btn-default" href="">Sign up</a>
    <a class="" href="">Login</a>`
  },
  {
    backgroundImage: "",
    backgroundColor: "rgba(252, 57, 117, 0.8)",
    caption: "Find the places to work on your projects",
    picto: 'picto-sprite-place-legend'
  },
  {
    backgroundImage: "",
    backgroundColor: "rgba(32, 222, 194, 0.8)",
    caption: "Find the coworkers you need",
    picto: 'picto-sprite-skill-legend'
  },
  {
    backgroundImage: "",
    backgroundColor: "rgba(252, 234, 16, 0.8)",
    caption: "Find the communities to share with",
    picto: 'picto-sprite-community-legend'
  },
  {
    backgroundImage: "",
    backgroundColor: "rgba(51, 51, 255, 0.8)",
    caption: "Find the machines to make your projects",
    picto: 'picto-sprite-machine-legend'
  }
];

class Home extends React.Component{
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log('Home this.props.location.query.signedUp: ', this.props.location.query.signedUp);
    if (this.props.location.query.signedUp) {
      setTimeout(function(){
        console.log('Has the param');
        Alert.info(`Done! To activate your account, please check the verification
          email we just sent to your email address`, {
          position: 'top',
          effect: 'jelly',
          timeout: 'none'
        });
      }, 500);
    }
  }
  render() {
    return (
      <div>
        <div className="home-page">
          <Slideshow slides={ _slides } />

          <section className="section-intro">
            <div className="container">
              <h3>EXPLORE <b>MAPKER</b></h3>
              <p>
                Pour aboutir à la silhouette extraordinairement profilée de l’iPad Air
                2, nous avons commencé par repenser l’écran Retina. Fusionner en une
                même couche les trois épaisseurs qui le composent nous a permis de
                créer un écran plus fin, mais surtout un meilleur écran. Le résultat
                de l’iPad Air 2 Pour aboutir à la silhouette extraora permis de créer
                un écran plus fin, mais surtout un meilleur écran.
              </p>
            </div>
          </section>

          <section className="section-footer">
            <div className="container">
              <small>
                © Mapker.co 2016.
                Designed by Axel Delbrayère, developed by Pierre Mary.
              </small>
            </div>
          </section>
        </div>
      </div>
    );
  }
};

export default Home;
