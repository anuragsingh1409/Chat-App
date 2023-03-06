const socket= io()

const $messageForm = document.querySelector('#message')
const $messageFormInput = $messageForm.querySelector('#text')
const $messageFormButton = $messageForm.querySelector('#send-message')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('message',(message)=>{
    console.log(message)

    const html = Mustache.render(messageTemplate,{message})
    $messages.insertAdjacentHTML('beforeend',html)
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')

    const message=document.querySelector('#text').value

    socket.emit('sendMessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error)
        {
            return console.log(error)
        }
        console.log('Message Delivered!')
    })
})

document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation)
    {
        return alert('Geolocaton is not supported by your browser!')
    }
    $sendLocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        const lat =position.coords.latitude
        const long=position.coords.longitude

        socket.emit('sendLocation',{lat,long},()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Sent!')
        })
       $sendLocationButton.removeAttribute('disabled')
    })
})