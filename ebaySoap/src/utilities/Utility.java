package utilities;

import java.io.StringWriter;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;

public class Utility {
	public static String asString(JAXBContext pContext, Object pObject) throws JAXBException {

		StringWriter sw = new StringWriter();

		Marshaller marshaller = pContext.createMarshaller();
		marshaller.setProperty(Marshaller.JAXB_ENCODING, "UTF-8");
		marshaller.marshal(pObject, sw);

		return sw.toString();
	}
}
